import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_receipt_pdf(receipt, parent_name, remaining_balance, fee_category):
    """
    Generates a professional PDF receipt using ReportLab.
    Returns a bytes object containing the PDF content.
    """
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'ReceiptTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#4B2E21'), # Custom sidebar brown
        alignment=1 # Centered
    )
    
    subtitle_style = ParagraphStyle(
        'ReceiptSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#78716C'), # Neutral mute
        alignment=1
    )
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#4B2E21'),
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'ReceiptBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1C1917')
    )
    
    bold_style = ParagraphStyle(
        'ReceiptBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    elements = []
    
    # Header Banner
    elements.append(Paragraph("FIRSTCRY INTELLITOTS PORTAL", title_style))
    elements.append(Paragraph("Official Payment Receipt & Fee Settlement Ledger", subtitle_style))
    elements.append(Spacer(1, 15))
    
    # Decorative line
    line_data = [['']]
    line_table = Table(line_data, colWidths=[540], rowHeights=[2])
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F2E6B3')), # Brand secondary warm gold
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    elements.append(line_table)
    elements.append(Spacer(1, 15))
    
    # Receipt Details Table
    details_data = [
        [Paragraph("Receipt Number:", bold_style), Paragraph(receipt['receipt_number'], body_style),
         Paragraph("Payment Date:", bold_style), Paragraph(str(receipt['payment_date']), body_style)],
        [Paragraph("Payment Method:", bold_style), Paragraph(str(receipt['payment_method']).upper().replace('_', ' '), body_style),
         Paragraph("Status:", bold_style), Paragraph("COMPLETED & RECORDED", bold_style)]
    ]
    
    details_table = Table(details_data, colWidths=[110, 160, 100, 170])
    details_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(details_table)
    elements.append(Spacer(1, 15))
    
    # Student & Parent Information
    elements.append(Paragraph("Student & Parent Information", section_title))
    info_data = [
        [Paragraph("Student Name:", bold_style), Paragraph(receipt['student_name'], body_style)],
        [Paragraph("Parent Name:", bold_style), Paragraph(parent_name or 'N/A', body_style)],
        [Paragraph("Fee Category:", bold_style), Paragraph(fee_category or 'General Fee Account', body_style)]
    ]
    
    info_table = Table(info_data, colWidths=[110, 430])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFDF7')), # Cream card background
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E7E5E4')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 15))
    
    # Payment Ledger Table
    elements.append(Paragraph("Transaction Breakdown", section_title))
    ledger_data = [
        [Paragraph("Description", bold_style), Paragraph("Allocated Category", bold_style), Paragraph("Amount Paid", bold_style)]
    ]
    
    # Categories split breakdown
    if fee_category:
        categories = fee_category.split(" & ")
        share = float(receipt['amount_paid']) / len(categories)
        for cat in categories:
            ledger_data.append([
                Paragraph(f"Installment Payment - {cat}", body_style),
                Paragraph(cat, body_style),
                Paragraph(f"INR {share:.2f}", body_style)
            ])
    else:
        ledger_data.append([
            Paragraph("Installment Payment", body_style),
            Paragraph("General Fee", body_style),
            Paragraph(f"INR {float(receipt['amount_paid']):.2f}", body_style)
        ])
        
    # Totals
    ledger_data.append([Paragraph("", body_style), Paragraph("Total Amount Settled:", bold_style), Paragraph(f"INR {float(receipt['amount_paid']):.2f}", bold_style)])
    ledger_data.append([Paragraph("", body_style), Paragraph("Remaining Student Balance:", bold_style), Paragraph(f"INR {float(remaining_balance):.2f}", bold_style)])
    
    ledger_table = Table(ledger_data, colWidths=[240, 160, 140])
    ledger_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F5F5F4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E7E5E4')),
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor('#D6D3D1')),
        ('LINEBELOW', (0,-3), (-1,-3), 1.5, colors.HexColor('#4B2E21')), # Bold line before total
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(ledger_table)
    elements.append(Spacer(1, 40))
    
    # Signature / Footer
    footer_data = [
        [Paragraph("Verified by: FirstCry Intellitots Finance Office", body_style)],
        [Paragraph("Thank you for your prompt payment. This is a computer-generated receipt and requires no physical signature.", subtitle_style)]
    ]
    footer_table = Table(footer_data, colWidths=[540])
    footer_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(footer_table)
    
    # Build Document
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
