// Load JSON data and initialize
document.addEventListener("DOMContentLoaded", () => {
    fetch("articles.json")
        .then((response) => response.json())
        .then((data) => {
            initializeCategoryFilter(data.articles);
            renderArticles(data.articles);
            displayMostPopularArticle(data.articles);
        });

    initializeTheme();
    setupThemeToggle();
    setupSorting();
    setupCategoryFiltering();
});

// Render Articles
function renderArticles(articles) {
    const container = document.getElementById("articles-container");
    container.innerHTML = "";

    if (articles.length === 0) {
        container.innerHTML = `<p class="text-center">No articles available in this category.</p>`;
        return;
    }

    articles.forEach((article) => {
        const readingTime = Math.ceil(article.wordCount / 200);
        container.innerHTML += `
            <div class="col-md-6">
                <div class="card">
                    <!-- Card Image -->
                    <img src="${article.image}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.content.substring(0, 100)}...</p>
                        <small>Category: ${article.category} | Date: ${article.date}</small><br>
                        <small>Views: ${article.views} | Reading Time: ${readingTime} mins</small><br>
                        <button class="btn btn-primary mt-2" onclick="openArticleModal(${article.id})">Read More</button>
                    </div>
                </div>
            </div>`;
    });
}

// Open Article Modal
function openArticleModal(articleId) {
    fetch("articles.json")
        .then((response) => response.json())
        .then((data) => {
            const article = data.articles.find((item) => item.id === articleId);
            if (article) {
                document.getElementById("articleModalLabel").textContent = article.title;
                document.getElementById("modal-body-content").innerHTML = `
                    <p><strong>Category:</strong> ${article.category}</p>
                    <p><strong>Date:</strong> ${article.date}</p>
                    <p><strong>Views:</strong> ${article.views}</p>
                    <p><strong>Reading Time:</strong> ${Math.ceil(article.wordCount / 200)} mins</p>
                    <hr>
                    <p>${article.content}</p>`;
                const articleModal = new bootstrap.Modal(document.getElementById("articleModal"));
                articleModal.show();
            }
        });
}

// Initialize Category Filter Dropdown
function initializeCategoryFilter(articles) {
    const categories = [...new Set(articles.map((article) => article.category))];
    const categoryFilter = document.getElementById("category-filter");

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Sorting Functionality
function setupSorting() {
    document.getElementById("sort-options").addEventListener("change", () => {
        filterAndSortArticles(getCurrentSortOption(), getCurrentCategory());
    });
}

// Category Filtering Functionality
function setupCategoryFiltering() {
    document.getElementById("category-filter").addEventListener("change", () => {
        filterAndSortArticles(getCurrentSortOption(), getCurrentCategory());
    });
}

// Helper Functions
function getCurrentSortOption() {
    return document.getElementById("sort-options").value;
}

function getCurrentCategory() {
    return document.getElementById("category-filter").value;
}

// Filter and Sort Articles
function filterAndSortArticles(sortOption, selectedCategory) {
    fetch("articles.json")
        .then((response) => response.json())
        .then((data) => {
            let filteredArticles = data.articles;

            if (selectedCategory !== "all") {
                filteredArticles = filteredArticles.filter(
                    (article) => article.category === selectedCategory
                );
            }

            const sortedArticles = filteredArticles.sort((a, b) => {
                return sortOption === "views"
                    ? b.views - a.views
                    : new Date(b.date) - new Date(a.date);
            });

            renderArticles(sortedArticles);
        });
}

// Display Most Popular Article
function displayMostPopularArticle(articles) {
    const mostPopular = articles.reduce((prev, current) =>
        prev.views > current.views ? prev : current
    );
    document.getElementById("most-popular-article").innerHTML = `
        <div class="card">
            <!-- Most Popular Article Image -->
            <img src="${mostPopular.image}" class="card-img-top" alt="${mostPopular.title}">
            <div class="card-body">
                <h5 class="card-title">${mostPopular.title}</h5>
                <p>Views: ${mostPopular.views}</p>
                <button class="btn btn-primary mt-2" onclick="openArticleModal(${mostPopular.id})">Read More</button>
            </div>
        </div>`;
}


// Theme Toggle
function setupThemeToggle() {
    document.getElementById("theme-toggle").addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

// Initialize Theme
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
}
