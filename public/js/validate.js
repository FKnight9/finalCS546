function registerValidate(form) {
	var firstName = form.firstName.value.trim();
	if (firstName.length < 1) {
		alert("Firstname must be atleast one character, please try again.");
		event.preventDefault();
		form.firstName.focus();
		return False;
	}

	var lastName = form.lastName.value.trim();
	if (lastName.length < 1) {
		alert("Lastname must be atleast one character, please try again.");
		event.preventDefault();
		form.lastName.focus();
		return False;
	}


	var username = form.username.value.trim();
	if (username.length < 4) {
		alert("Username must be atleast 4 characters long, please try again.");
		event.preventDefault();
		form.username.focus();
		return False;
	}

	var password = form.password.value.trim();
	var passwordConfirm = form.passwordConfirm.value.trim();

	if (password !== passwordConfirm) {
		alert("Password does not match, please try again.");
		event.preventDefault();
		form.password.focus();
		return False;
	} else if (!(/(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])/.test(password)) || (password.length < 7)) {
		alert("Password must atleast 7 characters and have atleast one uppercase character, one lowercase character, and one number.");
		event.preventDefault();
		form.password.focus();
		return False;
	}

	return True;
}

function courseValidate(form) {
	return True;
}
