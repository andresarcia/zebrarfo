#!/usr/bin/python
 
"""
Get all the css files that are in the directory where is this script, from the android application and transform them to the format accepted by the zebra application
"""

__author__ = "Freddy Rondon"
__version__ = "2"

import glob
import os
import errno
import datetime
import json
import pprint

FOLDER_NAME = 'parsed'
FILE_NAME = 'zebra_parsed'
EXTENSION = 'json'

def make_sure_path_exists_and_delete_content(path):
	try:
		os.makedirs(path)
	except OSError as exception:
		if exception.errno != errno.EEXIST:
			raise
		else:
			files = glob.glob(path + "/*")
			for f in files:
				os.remove(f)

def cls():
	os.system('cls' if os.name == 'nt' else 'clear')

def print_info(files_parsed, samples_number, status):
	cls()
	print "Number of files parsed: " + str(files_parsed)
	print "Total number of samples: " + str(samples_number) + "\n"
	print "STATUS: " + status

def print_error(files_parsed, samples_number, missing_files, files):
	cls()
	print "ERROR: frequencies are different in file " + missing_files[0] + "\n"
	if samples_number > 0:
		print "SAVED"
		print "Number of files parsed: " + str(files_parsed)
		print "Total number of samples parsed: " + str(samples_number) + "\n"

	else:
		print "None saved" + "\n"

	print "Files parsed: "
	pprint.pprint(list(set(files) - set(missing_files)))
	print "\n"
	print "Missing files: "
	pprint.pprint(missing_files)

def dump_dic(path,data):
	with open(path, 'wb') as fp:
		json.dump(data, fp)

def num(s):
	try:
		return int(s)
	except ValueError:
		return float(s)

def parser_files_in_current_folder():
	make_sure_path_exists_and_delete_content('./' + FOLDER_NAME)
	dict = {}
	dict["frequencies"] = {}
	dict["frequencies"]["values"] = []
	dict["coordinates"] = []

	file_list = glob.glob("*.csv")
	file_list_bk = glob.glob("*.csv")
	files_parsed = 0
	samples_number = 0

	try:
		for filename in file_list_bk:
			fr = open(filename,'r')
			for i, line in enumerate(fr):
				data = []
				# values between lines are separeted by ;
				for value in line.split(';'):
					# replace , by .
					value = value.replace(',', '.')
					# delete white spaces
					value = value.strip()
					data.append(value)

				# frequencies
				if files_parsed == 0 and i == 0:
					frequencies = []
					for frequency in data[4:len(data)]:
						frequencies.append(num(frequency.replace('.', '')))
					dict["frequencies"]["values"] = frequencies

				# cheking frequencies
				elif files_parsed > 0 and i == 0:
					for frequency in data[4:len(data)]:
						if frequency in dict["frequencies"]["values"]:
							pass
						else:
							raise Exception("different frequencies")
				# power
				else:
					# check if lat and lng are different from 0
					if float(data[1]) != 0 and float(data[2]) != 0:
						dict["coordinates"].append({
							"lat": num(data[1]),
							"lng": num(data[2]),
							"date": str(datetime.datetime.now()), # fake date
							"cap": [float(x) for x in data[4:len(data)]]
						})
						samples_number += 1

			fr.close()
			file_list.remove(filename)
			files_parsed += 1
			print_info(files_parsed, samples_number, "Parsing files")

	except Exception, e:
		if samples_number > 0:
			dump_dic(FOLDER_NAME + '/' + FILE_NAME + '.' + EXTENSION, dict)

		print_error(files_parsed, samples_number, file_list, file_list_bk)

	else:
		print_info(files_parsed, samples_number, "Saving data...")
		dump_dic(FOLDER_NAME + '/' + FILE_NAME + '.' + EXTENSION, dict)
		print_info(files_parsed, samples_number, "DONE :)")

if __name__ == '__main__':
	parser_files_in_current_folder()
