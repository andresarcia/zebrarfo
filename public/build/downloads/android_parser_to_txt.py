#!/usr/bin/python
 
"""
Get all the css files that are in the directory where is this script, from the android application and transform them to the format accepted by the zebra application
"""

__author__ = "Freddy Rondon"


import glob
import os
import errno
import datetime

def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise

def parser_files_in_current_folder():
	folderNameResults = 'parsed'
	make_sure_path_exists('./' + folderNameResults)
	
	numberOfFile = 0

	for filename in glob.iglob(os.path.join('.', '*.csv')):
		
		fr = open(filename,'r')
		for i, line in enumerate(fr):
			splitLine = line.split(';')
			
			data = []
			power = []
			for value in splitLine:
				# replace , by .
				value = value.replace(',', '.')
				# delete white spaces
				value = value.strip()
				data.append(value)

			# frequencies
			if i == 0:
				frequencies = []
				frequenciesAux = data[4:len(data)]
				for frequency in frequenciesAux:
					frequencies.append(frequency.replace('.', ''))

			# check if lat and lng are 0
			elif float(data[1]) != 0 and float(data[2]) != 0:
				power = data[4:len(data)]
				fw = open(folderNameResults + '/' + str(numberOfFile) + '.txt',"w")
				
				for i, frequency in enumerate(frequencies):
					fw.write(str(frequency) + '\t' + str(power[i]) + '\n')

				# write latitude and longitude
				fw.write(str(data[1]) + '\n')
				fw.write(str(data[2]) + '\n')

				# write a fake date because android format does not give it
				fw.write(str(datetime.datetime.now()))

				# close the sample file
				fw.close()

				numberOfFile += 1

		fr.close()

parser_files_in_current_folder()