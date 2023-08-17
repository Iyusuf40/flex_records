#!/bin/bash


#####################################################
# Script: change_extension.sh
# Description: A script to change the extension of files in a directory.
#####################################################

# Usage:
#   ./change_extension prev_ext new_ext [dir]
#
# Arguments:
#   prev_ext:   The previous extension of the files to be renamed.
#   new_ext:    The new extension to replace the previous extension.
#   dir:        (Optional) The directory path where the files are located. If not provided, the script will operate in the current working directory.
#
# Notes:
#   - The script will search for files with the previous extension in the specified directory (or current working directory) and rename them with the new extension.
#   - The script supports the use of a wildcard (*) for the dir argument, which allows renaming files in nested directories.
#   - If a directory is provided, the script will change to that directory before renaming the files.
#   - If no directory is provided (or dir is set to 'dir'), the script will operate in the current working directory.
#   - The script uses two methods for renaming files: change_ext and change_ext_simp. You can choose either method by commenting/uncommenting the relevant lines in the main function.


# Check if the required arguments are provided
if [ ! "$2" ]; then
	echo 'usage: ./change_extension prev_ext new_ext [dir]'
	exit 99
fi

prev_ext="$1"  # Previous extension
new_ext="$2"   # New extension
save_ifs="$IFS"  # Save the current value of IFS (Internal Field Separator)

concat() {
	if [ $2 ]; then
		local -n res=$1
		res="$res$IFS$2"
	fi
}

change_ext() {
	IFS="."  # Set IFS to '.' for splitting file names
	read -ra ARR <<< "$1"  # Split file name into an array based on . separator
	len=${#ARR[@]}  # Get the length of the array
	pre=${ARR[0]}   # Store the file name prefix (without extension)
	# pre is not having $ because we are passing it by ref
	# look https://stackoverflow.com/a/50281697
	max_index=$(($len - 1))  # Calculate the maximum possible index of the array
	for (( i=1; i<$max_index; i++ )); do
		concat pre ${ARR[$i]}  # Concatenate the prefix with each fragment
	done
	mv "$1" "$pre.$2"  # Rename the file with the new extension
	IFS="$save_ifs"  # Restore the original value of IFS
}

change_ext_simp() {
	mv "$1" "${1%$2}$3"  # Use simple string manipulation to rename the file
}

changeDir() {
	dir="$1"  # Directory

	# Check if the directory is provided and not "dir"
	if [ "$dir" ] && [ "$dir" != "dir" ]; then
		# Check if the directory doesn't exist and is not "*" (wildcard)
		if [ ! -d "$dir" ] && [ "$dir" != "*" ]; then
			echo "directory does not exist"
			exit 99
		fi

		# Change to the specified directory if it's not "*"
		if [ "$dir" != "*" ]; then
			cd "$dir"
		fi
	fi
}

main() {
	dir="$3"  # Directory argument
	changeDir "$dir"  # Change directory if specified

	if [ "$dir" != "*" ]; then
		# Find files in the current directory with the previous extension and rename them
		for file in $(find -maxdepth 1 -name "*.$prev_ext"); do
			# change_ext "$file" "$new_ext"
			change_ext_simp "$file" "$prev_ext" "$new_ext"
		done
	else
		# Find files recursively with the previous extension and rename them
		for file in $(find -name "*.$prev_ext"); do
			# change_ext "$file" "$new_ext"
			change_ext_simp "$file" "$prev_ext" "$new_ext"
		done
	fi
}

main "$1" "$2" "$3"  # Execute the main function with the provided arguments

