function togglePasswordVisibility(e) {
    const input = e.target.previousSibling;
    input.type = (input.type == 'password')? 'text':"password";
}