import datetime
from flask import Blueprint, jsonify, g
from app.database import get_db_connection
from app.utils.auth import require_firebase_auth

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard-stats', methods=['GET'])
@require_firebase_auth(role='admin')
def get_dashboard_stats():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Fetch total students
            cursor.execute("SELECT COUNT(*) as total_students FROM students")
            total_students = cursor.fetchone()['total_students']
            
            # 2. Fetch overall summary metrics
            cursor.execute("""
                SELECT 
                    SUM(total_fee) as total_allocated,
                    SUM(paid_amount) as total_collected,
                    SUM(pending_amount) as total_pending,
                    SUM(admission_fee) as admission_allocated,
                    SUM(admission_fee_paid) as admission_collected,
                    SUM(term_fee) as term_allocated,
                    SUM(term_fee_paid) as term_collected,
                    SUM(daycare_fee) as daycare_allocated,
                    SUM(daycare_fee_paid) as daycare_collected
                FROM fees
            """)
            fees_summary = cursor.fetchone() or {}
            
            total_allocated = float(fees_summary.get('total_allocated') or 0.0)
            total_collected = float(fees_summary.get('total_collected') or 0.0)
            total_pending = float(fees_summary.get('total_pending') or 0.0)
            
            admission_allocated = float(fees_summary.get('admission_allocated') or 0.0)
            admission_collected = float(fees_summary.get('admission_collected') or 0.0)
            term_allocated = float(fees_summary.get('term_allocated') or 0.0)
            term_collected = float(fees_summary.get('term_collected') or 0.0)
            daycare_allocated = float(fees_summary.get('daycare_allocated') or 0.0)
            daycare_collected = float(fees_summary.get('daycare_collected') or 0.0)
            
            # 3. Calculate dynamic overdue fees using the evaluation rule
            cursor.execute("""
                SELECT SUM(amount) as total_overdue 
                FROM installments 
                WHERE CURRENT_DATE > due_date AND status != 'Paid'
            """)
            total_overdue_row = cursor.fetchone()
            total_overdue = float(total_overdue_row['total_overdue'] or 0.0)
            
            # 4. Fetch overdue accounts ledger details dynamically
            cursor.execute("""
                SELECT 
                    s.student_id,
                    s.student_name, 
                    s.parent_name, 
                    f.pending_amount as outstanding_amount, 
                    MIN(i.due_date) as oldest_due_date
                FROM students s
                JOIN fees f ON s.student_id = f.student_id
                JOIN installments i ON f.fee_id = i.fee_id
                WHERE CURRENT_DATE > i.due_date AND i.status != 'Paid'
                GROUP BY s.student_id, s.student_name, s.parent_name, f.pending_amount
            """)
            overdue_rows = cursor.fetchall()
            
            overdue_list = []
            today = datetime.date.today()
            for row in overdue_rows:
                oldest_due = row['oldest_due_date']
                if isinstance(oldest_due, str):
                    oldest_due_obj = datetime.date.fromisoformat(oldest_due)
                elif isinstance(oldest_due, datetime.datetime):
                    oldest_due_obj = oldest_due.date()
                else:
                    oldest_due_obj = oldest_due
                
                days_overdue = (today - oldest_due_obj).days if oldest_due_obj else 0
                
                overdue_list.append({
                    "student_id": row['student_id'],
                    "student_name": row['student_name'],
                    "parent_name": row['parent_name'],
                    "outstanding_amount": float(row['outstanding_amount'] or 0.0),
                    "due_date": oldest_due_obj.isoformat() if oldest_due_obj else None,
                    "days_overdue": max(0, days_overdue),
                    "status": "Overdue"
                })
                
            # Sort by days_overdue DESC
            overdue_list.sort(key=lambda x: x['days_overdue'], reverse=True)
            
        return jsonify({
            "success": True,
            "stats": {
                "totalStudents": total_students,
                "allocated": total_allocated,
                "collected": total_collected,
                "pending": total_pending,
                "overdue": total_overdue,
                "admissionAllocated": admission_allocated,
                "admissionCollected": admission_collected,
                "termAllocated": term_allocated,
                "termCollected": term_collected,
                "daycareAllocated": daycare_allocated,
                "daycareCollected": daycare_collected
            },
            "overdueAccounts": overdue_list
        })
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()
