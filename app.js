console.log('App lista');

const rowCard = document.querySelector('#row-card');
const items = document.querySelector('#items');
const footer = document.querySelector('#footer');
const btnAdd = document.querySelector('#btnAdd');
const templateCard = document.querySelector('#template-card').content;
const templateCart = document.querySelector('#template-cart').content;
const templateFooter = document.querySelector('#template-footer').content;
const fragment = new DocumentFragment();

let shoppingCart = {};

document.addEventListener('DOMContentLoaded', e => {
    fetchData();

    if (localStorage.getItem('cart')) {
        shoppingCart = JSON.parse(localStorage.getItem('cart'));
        drawCart();
    }
});

rowCard.addEventListener('click', e => { addProduct(e) })
items.addEventListener('click', e => { fnAcc(e) });



const fetchData = async () => {
    const res = await fetch('api.json');
    const data = await res.json();
    drawCards(data);
}



const drawCards = (data) => {
    data.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title;
        templateCard.querySelector('p').textContent = product.precio;
        templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl);
        templateCard.querySelector('button').dataset.id = product.id;

        const clone = templateCard.cloneNode(true);

        fragment.appendChild(clone);
    });

    rowCard.appendChild(fragment);
}

const addProduct = e => {
    if (e.target.classList.contains('btn-dark')) {
        setShoppingCart(e.target.parentElement);
    }
    e.stopPropagation();
}

const setShoppingCart = obj => {
    const producto = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        price: obj.querySelector('p').textContent,
        cant: 1
    }

    if (shoppingCart.hasOwnProperty(producto.id)) {
        producto.cant = shoppingCart[producto.id].cant + 1;
    }

    shoppingCart[producto.id] = { ...producto }
    drawCart();
}

const drawCart = () => {
    items.innerHTML = '';
    Object.values(shoppingCart).forEach(producto => {
        templateCart.querySelector('th').textContent = producto.id;
        templateCart.querySelectorAll('td')[0].textContent = producto.title;
        templateCart.querySelectorAll('td')[1].textContent = producto.cant;
        templateCart.querySelector('.btn-info').dataset.id = producto.id;
        templateCart.querySelector('.btn-danger').dataset.id = producto.id;
        templateCart.querySelector('span').textContent = producto.cant * producto.price;

        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone);
    });

    items.appendChild(fragment);
    drawFooter();

    localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

const drawFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(shoppingCart).length == 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return;
    }

    const nCant = Object.values(shoppingCart).reduce((acc, { cant }) => acc + cant, 0);
    const nPrice = Object.values(shoppingCart).reduce((acc, { cant, price }) => acc + (cant * price), 0);

    templateFooter.querySelectorAll('td')[0].textContent = nCant;
    templateFooter.querySelector('span').textContent = nPrice;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const btnEmptyCart = document.querySelector('#vaciar-carrito');

    btnEmptyCart.addEventListener('click', () => {
        shoppingCart = {};
        drawCart();
    });

}

const fnAcc = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = shoppingCart[e.target.dataset.id];
        producto.cant++;
        shoppingCart[e.target.dataset.id] = { ...producto };
        drawCart();
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = shoppingCart[e.target.dataset.id];
        producto.cant--;
        shoppingCart[e.target.dataset.id] = { ...producto };
        drawCart();

        if (producto.cant == 0) {
            delete shoppingCart[e.target.dataset.id];
            drawCart();
        }
    }

    e.stopPropagation();
}

