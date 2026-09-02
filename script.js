//
let slideIndex = 1;

// 上一張/下一張
function plusSlides(n) {
  showSlides(slideIndex += n);
}
// 點擊圓點
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  if (slides.length === 0) {return;}
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  // 隱藏所有圖片
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  // 移除active
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  // 顯示目前圖片
  slides[slideIndex-1].style.display = "flex";
  // 顯示目前dot  
  dots[slideIndex-1].className += " active";
}

let timer;

// 啟動輪播 
document.addEventListener("DOMContentLoaded", function() {
  const slides =document.getElementsByClassName("mySlides");
  if (slides.length > 0) {
    showSlides(slideIndex);
    timer = setInterval(function() {plusSlides(1);}, 2000);
    const slideshow =document.querySelector(".slideshow-container");
    if (slideshow) {
      // 滑鼠移入 → 暫停
      slideshow.addEventListener("mouseenter", function() {clearInterval(timer);});
      // 滑鼠移出 → 繼續
      slideshow.addEventListener("mouseleave", function() {
        clearInterval(timer);
        timer = setInterval(function() {plusSlides(1);}, 2000);
      });
    }
  }
});

// 會員登入 Modal
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("id01");
  const loginButtons = document.querySelectorAll(".login");
  const closeButton = document.querySelector(".close");
  const cancelButton = document.querySelector(".cancelbtn");

  // 如果沒有登入視窗
  if (!modal) {return;}

  // 點擊會員登入
  loginButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
      event.stopPropagation();
      modal.style.display = "block";
    });
  });

  // 點 X
  if (closeButton) {
    closeButton.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }

  // 點取消
  if (cancelButton) {
    cancelButton.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }

  // 點擊背景
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// 會員登入功能
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginform");
  const modal = document.getElementById("id01");
  if (!loginForm) {
    return;
  }
  loginForm.addEventListener("submit", function(event) {
    // 阻止表單真的送到 action_page.php
    event.preventDefault();
    const username = document.getElementById("uname").value;
    const password = document.getElementById("psw").value;
    // Demo 用的帳號密碼
    if (username === "admin" && password === "1234") {
      alert("登入成功！歡迎 " + username + "！");
      // 關閉登入視窗
      modal.style.display = "none";
    } 
    else {
      alert("帳號或密碼錯誤！");
    }
  });
});

// About-----------------------------------------------------------------------------------------------
// 找出所有 class = "fade" 的元素
const fadeElements = document.querySelectorAll(".fade");
// 監控元素是否出現在畫面中
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 如果元素進入畫面
    if (entry.isIntersecting) {
      // 加上 show
      entry.target.classList.add("show");
      // 已經出現過就停止觀察
      observer.unobserve(entry.target);
    }
  });
});

// 觀察每一個 fade 元素
fadeElements.forEach((element) => {
  observer.observe(element);
});

// Cart------------------------------------------------------------------------------------------------
// 從 localStorage 取得購物車資料
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 儲存購物車
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 加入購物車
function addToCart(name, price, image) {
  console.log("加入購物車：", name, price, image);
  // 找看看購物車裡面有沒有這個商品
  const existingItem = cart.find(function(item) {
    return item.name === name;
  });

  // 如果已經有這個商品
  if (existingItem) {
    existingItem.quantity++;
  }
  // 如果還沒有這個商品
  else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  // 儲存到 localStorage
  saveCart();

  // 更新購物車數量
  updateCartCount();

  // 顯示提示
  alert(name + " 已加入購物車！");
}

// 更新購物車數量
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");

  // 如果目前頁面沒有購物車數字
  if (!cartCount) {return;}

  let count = 0;

  // 計算商品總數量
  cart.forEach(function(item) {
    count += item.quantity;
  });
  cartCount.textContent = count;
}

// 顯示購物車
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // 如果不是 cart.html
  if (!cartItems) {return;}

  // 清空原本內容
  cartItems.innerHTML = "";

  let total = 0;

  // 購物車是空的
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>購物車目前是空的</p>";
    if (cartTotal) {
        cartTotal.textContent = "NT$ 0";
    }
    updateCartCount();
    return;
  }

  // 顯示每個商品
  cart.forEach(function(item, index) {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class = "cart-product">
        <img src = "${item.image}" alt = "${item.name}">
        <div>
          <strong>${item.name}</strong>
          <p>單價：NT$ ${item.price}</p>
          <p>小計：NT$ ${subtotal}</p>
        </div>
      </div>
      <div class = "cart-controls">
        <button onclick = "changeQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick = "changeQuantity(${index}, 1)">+</button>
        <button class = "remove-cart" onclick = "removeFromCart(${index})">刪除</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  // 顯示總金額
  if (cartTotal) {
    cartTotal.textContent = "NT$ " + total;
  }

  // 更新購物車數量
  updateCartCount();
}

// 修改數量
function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  // 數量小於等於 0
  if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

// 刪除商品
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// 結帳
function checkout() {
  if (cart.length === 0) {
    alert("購物車目前沒有商品");
    return;
  }
  alert("訂單成立！感謝您的購買 ❤️");

  // 清空購物車
  cart = [];
  saveCart();
  renderCart();
}

// 網頁載入完成
document.addEventListener("DOMContentLoaded", function() {
  // 更新購物車數字
  updateCartCount();

  // 顯示購物車
  renderCart();
});

// 漢堡選單
function toggleMenu() {
    // 找到導覽列
    const navMenu = document.getElementById("Menu");

    // 加上或移除 active
    navMenu.classList.toggle("active");
}