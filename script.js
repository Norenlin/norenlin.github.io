console.log("目前載入的是新的 script.js");
//-------------------------------index圖片輪播-------------------------------------------------
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
  if (dots.length > 0 && dots[slideIndex-1]) {
    dots[slideIndex-1].className += " active";
  }
}

let timer;

// 啟動輪播
function startSlideshow() {
  clearInterval(timer);
  timer = setInterval(function() {
    plusSlides(1);
  }, 2000);
}

// 停止輪播
function stopSlideshow() {
  clearInterval(timer);
}

// 網頁載入完成
document.addEventListener("DOMContentLoaded", function() {
  const slides =document.getElementsByClassName("mySlides");
  if (slides.length > 0) {
    showSlides(slideIndex);
    startSlideshow();

    const slideshow =document.querySelector(".slideshow-container");
    if (slideshow) {
      // 滑鼠移入 → 暫停
      slideshow.addEventListener("mouseenter", function() {
        stopSlideshow();
      });

      // 滑鼠移出 → 繼續
      slideshow.addEventListener("mouseleave", function() {
        startSlideshow();
      });
    }
  }
});


// ---------------------------------------會員登入 / 註冊---------------------------------------------

document.addEventListener("DOMContentLoaded", function() {

    const loginModal = document.getElementById("id01");
    const registerModal = document.getElementById("registerModal");

    // 只抓導覽列的會員登入按鈕
    const loginButtons = document.querySelectorAll("nav .login");

    const closeButton =
        loginModal ? loginModal.querySelector(".close") : null;

    const registerCloseButton =
        registerModal ?
        registerModal.querySelector(".register-close") : null;

    const cancelButton =
        loginModal ?
        loginModal.querySelector(".cancelbtn") : null;

    const registerCancelButton =
        registerModal ?
        registerModal.querySelector(".register-cancel") : null;


    // ==========================================
    // 點擊「會員登入」
    // ==========================================

    loginButtons.forEach(function(button) {

        button.addEventListener("click", function(event) {

            event.stopPropagation();

            if (loginModal) {
                loginModal.style.display = "block";
            }

        });

    });


    // ==========================================
    // 關閉登入視窗
    // ==========================================

    if (closeButton) {

        closeButton.addEventListener("click", function() {

            loginModal.style.display = "none";

        });

    }


    // ==========================================
    // 登入取消
    // ==========================================

    if (cancelButton) {

        cancelButton.addEventListener("click", function() {

            loginModal.style.display = "none";

        });

    }


    // ==========================================
    // 關閉註冊視窗
    // ==========================================

    if (registerCloseButton) {

        registerCloseButton.addEventListener(
            "click",
            function() {

                registerModal.style.display = "none";

            }
        );

    }


    // ==========================================
    // 註冊取消
    // ==========================================

    if (registerCancelButton) {

        registerCancelButton.addEventListener(
            "click",
            function() {

                registerModal.style.display = "none";

            }
        );

    }


    // ==========================================
    // 點擊背景關閉視窗
    // ==========================================

    window.addEventListener("click", function(event) {

        if (event.target === loginModal) {

            loginModal.style.display = "none";

        }

        if (event.target === registerModal) {

            registerModal.style.display = "none";

        }

    });

});


// =====================================================
// 顯示註冊視窗
// =====================================================

function showRegister() {

    const loginModal =
        document.getElementById("id01");

    const registerModal =
        document.getElementById("registerModal");


    // 關閉登入視窗
    if (loginModal) {

        loginModal.style.display = "none";

    }


    // 開啟註冊視窗
    if (registerModal) {

        registerModal.style.display = "block";

    }

}


// =====================================================
// 回到登入
// =====================================================

function showLogin() {

    const loginModal =
        document.getElementById("id01");

    const registerModal =
        document.getElementById("registerModal");


    // 關閉註冊
    if (registerModal) {

        registerModal.style.display = "none";

    }


    // 開啟登入
    if (loginModal) {

        loginModal.style.display = "block";

    }

}


// =====================================================
// 會員登入
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    const loginForm =
        document.getElementById("loginform");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async function(event) {

            // 阻止表單重新整理
            event.preventDefault();


            const username =
                document
                    .getElementById("uname")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("psw")
                    .value;


            try {

                // 呼叫 Node.js 後端
                const response = await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }
                );


                const result =
                    await response.json();


                console.log(
                    "登入結果：",
                    result
                );


                // 登入失敗
                if (!response.ok || !result.success) {

                    alert(
                        result.message || "登入失敗"
                    );

                    return;

                }


                // 登入成功
                alert(
                    "登入成功！歡迎 " +
                    result.user.username +
                    "！"
                );


                // 儲存登入會員
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(result.user)
                );


                // 關閉登入視窗
                const modal =
                    document.getElementById("id01");


                if (modal) {

                    modal.style.display = "none";

                }


                // 清空登入欄位
                loginForm.reset();

            }

            catch (error) {

                console.error(
                    "登入錯誤：",
                    error
                );

                alert(
                    "無法連接伺服器，請確認 Node.js 是否啟動。"
                );

            }

        }
    );

});


// =====================================================
// 會員註冊
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function(event) {

            // 阻止表單重新整理
            event.preventDefault();


            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const passwordAgain =
                document
                    .getElementById("registerPasswordAgain")
                    .value;


            // ======================================
            // 確認兩次密碼
            // ======================================

            if (password !== passwordAgain) {

                alert("兩次輸入的密碼不相同！");

                return;

            }


            try {

                // 呼叫 Node.js 註冊 API
                const response = await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }
                );


                const result =
                    await response.json();


                console.log(
                    "註冊結果：",
                    result
                );


                // 註冊失敗
                if (!response.ok || !result.success) {

                    alert(
                        result.message || "註冊失敗"
                    );

                    return;

                }


                // 註冊成功
                alert(
                    "註冊成功！現在可以登入了。"
                );


                // 清空註冊表單
                registerForm.reset();


                // 回到登入
                showLogin();

            }

            catch (error) {

                console.error(
                    "註冊錯誤：",
                    error
                );

                alert(
                    "無法連接伺服器，請確認 Node.js 是否啟動。"
                );

            }

        }
    );

});


// -----------------------------------------------About 品牌故事---------------------------------------------------

// 找出所有 class = "fade" 的元素
document.addEventListener("DOMContentLoaded", function() {

  const fadeElements = document.querySelectorAll(".fade");

  // 如果沒有 fade 元素就不用執行
  if (fadeElements.length === 0) {
    return;
  }

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

});


// ----------------------------------------------Cart 購物車-----------------------------------------------

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
  if (!cartCount) {
    return;
  }

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
  if (!cartItems) {
    return;
  }

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

        <img
          src = "${item.image}"
          alt = "${item.name}"
        >

        <div>

          <strong>${item.name}</strong>

          <p>
            單價：NT$ ${item.price}
          </p>

          <p>
            小計：NT$ ${subtotal}
          </p>

        </div>

      </div>

      <div class = "cart-controls">

        <button
          onclick = "changeQuantity(${index}, -1)"
        >
          -
        </button>

        <span>
          ${item.quantity}
        </span>

        <button
          onclick = "changeQuantity(${index}, 1)"
        >
          +
        </button>

        <button
          class = "remove-cart"
          onclick = "removeFromCart(${index})"
        >
          刪除
        </button>

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


// =====================================================
// 商品 API
// =====================================================

async function loadProducts() {

    const productList =
        document.getElementById("productList");


    // 如果現在不是商品頁面
    // 就不用執行

    if (!productList) {

        return;

    }


    try {

        // 向 Node.js 後端取得商品
        const response =
            await fetch("/api/products");


        // 將結果轉成 JSON
        const result =
            await response.json();


        console.log(
            "後端商品資料：",
            result
        );


        if (!response.ok || !result.success) {

            throw new Error(
                "取得商品失敗"
            );

        }


        productList.innerHTML = "";


        // 逐一建立商品
        result.data.forEach(product => {


            const productElement =
                document.createElement("div");


            productElement.className =
                "product";


            productElement.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <h2>
                        ${product.name}
                    </h2>


                    <p>
                        ${product.description}
                    </p>


                    <p class="price">
                        NT$${product.price}
                    </p>


                    <button
                        onclick="addToCart(
                            '${product.name}',
                            ${product.price},
                            '${product.image}'
                        )"
                    >
                        加入購物車
                    </button>

                </div>

            `;


            productList.appendChild(
                productElement
            );

        });


    }

    catch (error) {

        console.error(
            "商品載入錯誤：",
            error
        );


        productList.innerHTML = `

            <p>
                商品載入失敗，請確認後端伺服器是否啟動。
            </p>

        `;

    }

}


// ------------------------------------------漢堡選單------------------------------------------------------

function toggleMenu() {

    // 找到導覽列
    const navMenu = document.getElementById("Menu");

    if (!navMenu) {
        return;
    }

    // 加上或移除 active
    navMenu.classList.toggle("active");
}


// =====================================================
// 網頁載入完成
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // 購物車

        updateCartCount();

        renderCart();


        // 商品

        loadProducts();

    }
);