from fpdf import FPDF
from PIL import Image,ImageOps
import sys
import os
import datetime

TABLE_COL_NAMES = ("Item Id","Item Name", "Qty", "Item Price", "Total Price")	
	
def render_table_header(pdf):
	pdf.set_font("times", size=10)
	line_height = pdf.font_size * 2
	col_width = pdf.epw / len(TABLE_COL_NAMES)  # distribute content evenly

	pdf.set_font('times','B')  # enabling bold text
	for col_name in TABLE_COL_NAMES:
		pdf.cell(col_width, line_height, col_name, border=1,align='C')
	pdf.ln(0)
	pdf.set_font(style="")

def createPdf(reg_no,data,images_folder):
	pdf = FPDF('P','mm','A4')
	pdf.add_page()
	pdf.set_image_filter("DCTDecode")

	# variables
	full_name = data['Full Name'] # customer name
	date = datetime.date.today()
	customer_id = '' 
	company_name = ''
	invoice_id = ''
	line_height = pdf.font_size * 2
	col_width = pdf.epw / len(TABLE_COL_NAMES)  # distribute content evenly
	font_face = 'times'
	logo_path = '{images_folder}/logo.png'.format(images_folder=images_folder)
	pdf_path = 'generated_pdf/{pdf_name}.pdf'.format(pdf_name = reg_no)

	# logo
	img = Image.open(logo_path)
	img = img.resize((80,30))
	img = ImageOps.expand(img,border=1)
	pdf.image(img, x=10, y=5,alt_text='{reg_no} image'.format(reg_no=reg_no))

	# student image
	img = Image.open(img_path)
	img = img.resize((100,110))
	img = ImageOps.expand(img,border=1)
	pdf.image(img, x=160, y=25,alt_text='{reg_no} image'.format(reg_no=reg_no))

	# header
	pdf.set_font(font_face,'BU',15)
	pdf.cell(w=0,txt='Report Card\n',align='C')
	pdf.ln(15)

	# details
	pdf.set_font(font_face,'B',10 )
	pdf.cell(txt='Registration Number: {regn}'.format(regn = reg_no))
	pdf.ln(5)
	pdf.cell(txt='Name: {fn}'.format(fn = full_name))
	pdf.ln(5)
	pdf.cell(txt='Grade: {gd}'.format(gd = grade))
	pdf.ln(5)
	pdf.cell(txt='Gender: {gen}'.format(gen = gender))
	pdf.ln(5)
	pdf.cell(txt='Date of Birth: {gen}'.format(gen = dob))
	pdf.ln(5)
	pdf.cell(txt='Place: {city} , {country}'.format(city = city,country = country))
	pdf.ln(25)

	# table	
	for round in data['Result']:
		# key val pair or round and round scores
		pdf.set_font(font_face,'BU',12 )
		line_height = pdf.font_size * 2
		pdf.cell(w=0,txt='Round {round}'.format(round=round),align='C')
		pdf.ln(7)
		
		pdf.set_font(font_face,'',10)
		line_height = pdf.font_size * 2

		render_table_header(pdf)
		pdf.ln(line_height)

		for row in data['Result'][round]:
			if pdf.will_page_break(line_height):
				render_table_header(pdf)
			for datum in row:
				if(datum=='obtained_score'):
					if(row[datum] == '0'):
						pdf.set_text_color(220,20,60)
					else:
						pdf.set_text_color(34,200,34)
				pdf.cell(col_width, line_height, row[datum], border=1,align='C')
			pdf.set_text_color(0,0,0)
			pdf.ln(line_height)
		
		pdf.add_page()

	pdf.output(pdf_path)

def main():
	if not os.path.exists('generated_pdf'):
		os.makedirs('generated_pdf')

	file_name = sys.argv[1]
	images_folder = sys.argv[2]
	df = pd.read_excel(file_name)

	# make 1st row as header row
	df.columns = df.iloc[0]

	# drop 1st row
	df = df[1:]

	# get unique student data list
	student_data_list = df[df.columns[0:13][2:]]
	student_data_list =  student_data_list.drop_duplicates(subset=['Registration Number'])
	student_data_list = student_data_list.T.to_dict().values()

	# add all data student wise
	student_data = {}

	for i in student_data_list:
		i['Result'] = {}
		i = dict((key.strip(),val) for (key,val) in i.items())
		student_data[i['Registration Number']] = i

	rows = df.itertuples()

	for row in rows:
		row = row[1:]
		reg_no = row[5]
		round = row[1]

		data = {
			'question_no' : str(row[13]),
			'option_marked' : str(row[14]),
			'correct_option' : str(row[15]),
			'max_score' : str(row[17]),
			'obtained_score' : str(row[18]),
		}
		if(str(round) not in student_data[reg_no]['Result']):
			student_data[reg_no]['Result'][str(round)] = []
		student_data[reg_no]['Result'][str(round)].append(data)

	for k in student_data:
		createPdf(k,student_data[k],images_folder)
		print('creating {reg}.pdf'.format(reg=k))
	print('all pdfs created')

if __name__ == '__main__':
	main()