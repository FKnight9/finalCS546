function registerValidate(form) {
	var firstName = form.firstName.value.trim();
	if (firstName.length < 1) {
		M.toast({html: "Firstname must be at least one character, please try again."})
		event.preventDefault();
		form.firstName.focus();
		return False;
	}

	var lastName = form.lastName.value.trim();
	if (lastName.length < 1) {
		M.toast({html: "Lastname must be at least one character, please try again."})
		event.preventDefault();
		form.lastName.focus();
		return False;
	}


	var username = form.username.value.trim();
	if (username.length < 4) {
		M.toast({html: "Username must be at least 4 characters long, please try again."})
		event.preventDefault();
		form.username.focus();
		return False;
	}

	var password = form.password.value.trim();
	var passwordConfirm = form.passwordConfirm.value.trim();

	if (password !== passwordConfirm) {
		M.toast({html: "Password does not match, please try again."})
		event.preventDefault();
		form.password.focus();
		return False;
	} else if (!(/(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])/.test(password)) || (password.length < 7)) {
		M.toast({html: "Password must be at least 7 characters long, have at least one uppercase character, one lowercase character, and one number."})
		event.preventDefault();
		form.password.focus();
		return False;
	}

	return True;
}

function courseValidate(form) {
	var courseCode = form.courseCode.value.trim().toUpperCase();
	console.log(courseCode)
	console.log(/[A-Z]{2,}[0-9]{3}/.test(courseCode))
	console.log(courseCode.length < 6)
	if ((!(/[A-Z]{2,}[0-9]{3}/.test(courseCode))) || (courseCode.length < 5)) {
		M.toast({html: "Course code must be at least 5 characters long, have at least two alpha characters, and have three numeric characters."})
		event.preventDefault();
		form.courseCode.focus();
		return False;
	}

	var courseName = form.courseName.value.trim();
	if (courseName.length < 1) {
		M.toast({html: "Course name must be at least one character, please try again."})
		event.preventDefault();
		form.courseName.focus();
		return False;
	}

	return True;
}
