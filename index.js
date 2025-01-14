const Modal = document.getElementById("modal")

const Products = document.getElementById("products")
const ProductsBody = Products.querySelector("tbody")

const Favs = document.getElementById("favs")
const FavsBody = Favs.querySelector("tbody")

var isProductsPage = true

window.onclick = (e) => {
    console.log(e.target)
    if (e.target == Modal) {
        Modal.style.display = "none"
    }
}

function showProducts() {
    if (!isProductsPage) {
        isProductsPage = true
        fetch("https://dummyjson.com/products?limit=20")
            .catch(err => console.error(err))
            .then(res => res.json())
            .then(data => {
                ProductsBody.innerHTML = ""
                const products = data.products
                for(const product of products) {
                    const p = new Product(product)
                    ProductsBody.appendChild(p.ToHTML())
                }
                Products.style.display = "table"
                Favs.style.display = "none"
            })
    }
}

function showFavs() {
    if (isProductsPage) {
        isProductsPage = false
        fetch("http://localhost:8080/favorites.php", {
            method: "GET",
        })
            .catch(err => console.error(err))
            .then(res => res.json())
            .then(favs => {
                FavsBody.innerHTML = ""
                for(const favId in favs) {
                    const f = new Fav({id: favId, title: favs[favId]})
                    FavsBody.appendChild(f.ToHTML())
                }
                Products.style.display = "none"
                Favs.style.display = "table"
            })
    }
}

class Fav {
    #fav

    constructor(fav) {
        this.#fav = fav
    }


    #addCell(tr, value) {
        const td = document.createElement("td")
        td.textContent = value
        tr.appendChild(td)
    }

    ToHTML() {
        const tr = document.createElement("tr")
        tr.classList.add("product")

        this.#addCell(tr, this.#fav.id)
        this.#addCell(tr, this.#fav.title)

        return tr
    }
}

class Product {
    #product

    constructor(product) {
        this.#product = product
    }

    #addCell(tr, value) {
        const td = document.createElement("td")
        td.textContent = value
        tr.appendChild(td)
    }

    ToHTML() {
        const tr = document.createElement("tr")
        tr.classList.add("product")

        this.#addCell(tr, this.#product.id)
        this.#addCell(tr, this.#product.title)
        this.#addCell(tr, this.#product.price)

        tr.onclick = () => {
            Modal.style.display = "flex"

            const image = document.getElementById("modal-image")
            image.src = this.#product.images[0]

            const category = document.getElementById("modal-category")
            category.innerHTML = `<p><strong>Категория: </strong>${this.#product.category}</p>`

            const desc = document.getElementById("modal-desc")
            desc.innerHTML = `<p><strong>Описание: </strong>${this.#product.description}</p>`

            const fav = document.getElementById("modal-fav")
            const data = new FormData()
            data.append("id", this.#product.id)
            data.append("title", this.#product.title)

            fav.onclick = (e) => {
                fetch("http://localhost:8080/favorites.php", {
                    method: "POST",
                    body: data,
                })
            }
        }

        return tr
    }
}
window.onload = () => {
    fetch("https://dummyjson.com/products?limit=20")
        .catch(err => console.error(err))
        .then(res => res.json())
        .then(data => {
            const products = data.products
            for(const product of products) {
                const p = new Product(product)
                ProductsBody.appendChild(p.ToHTML())
            }
        })
}

