const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const userDetails = document.getElementById('userDetails');
const repositories = document.getElementById('repositories');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const paginationContainer = document.getElementById('paginationContainer');

searchButton.addEventListener('click', searchUser);
previousButton.addEventListener('click', fetchPreviousData);
nextButton.addEventListener('click', fetchNextData);

let currentPage = 1;
let userData;
let repositoriesData;
function searchUser() {
  const username = searchInput.value;

  if (username === '') {
    alert('Please enter a username');
    return;
  }

  fetchUserDetails(username)
    .then((data) => {
      userData = data;
      displayUserDetails(userData);
      enablePaginationButtons();
    })
    .catch((error) => {
      console.log('Error:', error);
    });

  fetchRepositories(username)
    .then((data) => {
      repositoriesData = data;
      displayRepositories(repositoriesData);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

function fetchUserDetails(username) {
  const url = `https://api.github.com/users/${username}`;
  showLoadingBar();
  return fetch(url)
    .then((response) => {
      hideLoadingBar();

      return response.json();
    })
    .catch((error) => {
      hideLoadingBar();
      throw new Error('Unable to fetch user details');
    });
}

function displayUserDetails(data) {
  userDetails.innerHTML = `
    <div class="user-image">
        <img src="${data.avatar_url}" alt="User Avatar" class="avatar">
        <a href="${data.html_url}" target="_blank" class="profile-button">Visit Profile</a>
    </div>
    <div>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location || 'Not available'}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
        <p><strong>Following:</strong> ${data.following}</p>
    </div>
  `;

  userDetails.classList.add('show-content');
}

function fetchRepositories(username) {
  const perPage = 10;
  const url = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`;

  showLoadingBar();

  return fetch(url)
    .then((response) => {
      hideLoadingBar();

      return response.json();
    })
    .catch((error) => {
      hideLoadingBar();
      throw new Error('Unable to fetch repositories');
    });
}

function displayRepositories(data) {
  repositories.innerHTML = '';

  data.forEach((repo) => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');
    const description = repo.description ? repo.description.slice(0, 100) + '...' : 'No description';

    repoCard.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${description}</p>
      <p><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
      <a href="${repo.html_url}" target="_blank" class="repo-button">View Repository</a>
    `;

    repositories.appendChild(repoCard);
  });

  repositories.classList.add('show-content');
  paginationContainer.classList.add('show-content');
}

function enablePaginationButtons() {
  previousButton.disabled = false;
  nextButton.disabled = false;
}

function fetchPreviousData() {
  if (currentPage > 1) {
    currentPage--;
    fetchRepositories(userData.login)
      .then((data) => {
        repositoriesData = data;
        displayRepositories(repositoriesData);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}

function fetchNextData() {
  currentPage++;
  fetchRepositories(userData.login)
    .then((data) => {
      repositoriesData = data;
      displayRepositories(repositoriesData);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}


function showLoadingBar() {
  const loadingBar = document.getElementById('loadingBar');
  loadingBar.style.width = '0%';
  loadingBar.style.display = 'block';
}
function hideLoadingBar() {
  const loadingBar = document.getElementById('loadingBar');
  loadingBar.style.width = '100%';

  setTimeout(() => {
    loadingBar.style.display = 'none';
  }, 500);
}
