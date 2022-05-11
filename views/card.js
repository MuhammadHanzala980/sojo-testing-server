const stripe = Stripe('pk_test_51K46yCFn2LpnmXjwRomYCTMe3vYkUOJy2cncz1pn5OkfTi4sQ474uYCSmFqxk2QNElVXUxAfvUo3JdY6MdeDtkm100jEaRtQUk'); // Your Publishable Key
const elements = stripe.elements();

console.log(stripe)

// Create our card inputs
var style = {
  base: {
    color: "#fff"
  }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

// Give our token to our form
const stripeTokenHandler = token => {
  console.log(token, "Token")
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  form.submit();
}

// 6234061006105645

// Create token from card data
form.addEventListener('submit', e => {
    e.preventDefault();
    console.log("00000")
    
  stripe.createToken(card).then(res => {
    console.log(res)
    if (res.error) {
      errorEl.textContent = res.error.message;
    }
    else stripeTokenHandler(res.token);
  })
})