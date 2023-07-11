function addToCart(pid) {
    const cid = "647f7ec17e08f513ef4b1a0b"
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/api/carts/${cid}/product/${pid}`;
    document.body.appendChild(form);
    form.submit();
  }