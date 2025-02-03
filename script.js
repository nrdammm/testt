// Initialize users and posts arrays from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Current user information
const currentUser  = (localStorage.getItem('loggedInUser ') || '').trim(); // Updated line

// Login Logic
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Find user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('loggedInUser ', username); // Updated line
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            document.getElementById('loginError').style.display = 'block'; // Show error message
        }
    });
}

// Other code...
// Registration Logic
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (users.some(u => u.username === username)) {
      document.getElementById('registerError').style.display = 'block';
      document.getElementById('registerSuccess').style.display = 'none';
    } else {
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      document.getElementById('registerError').style.display = 'none';
      document.getElementById('registerSuccess').style.display = 'block';
    }
  });
}

// Dashboard Logic
if (document.getElementById('loggedInUser ')) {
  if (currentUser ) {
    document.getElementById('loggedInUser ').textContent = currentUser ; // Removed extra space
    renderPosts(); // Render posts after setting the current user
  } else {
    window.location.href = 'index.html'; // Redirect if not logged in
  }
}

// Function to upload avatar
function uploadAvatar() {
  const fileInput = document.getElementById('avatarUpload');
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    // Update user's avatar in localStorage
    const userIndex = users.findIndex(u => u.username === currentUser );
    if (userIndex !== -1) {
      users[userIndex].avatar = e.target.result;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Avatar updated successfully!');
      renderPosts(); // Re-render posts to show updated avatar
    }
  };
  reader.readAsDataURL(file);
}

// Function to create a new post
function createPost() {
  const text = document.querySelector('.post-input').value;
  const fileInput = document.getElementById('imageUpload');
  const image = fileInput.files[0];

  if (!text && !image) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const newPost = {
      user: currentUser ,
      text: text,
      image: image ? e.target.result : null,
      timestamp: new Date().toISOString()
    };

    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    clearForm();
  };

  if (image) {
    reader.readAsDataURL(image);
  } else {
    reader.onload({ target: { result: null } });
  }
}

// Function to render posts
function renderPosts() {
  const feed = document.getElementById('postFeed');
  feed.innerHTML = '';

  posts.forEach(post => {
    const user = users.find(u => u.username === post.user);
    const avatar = user?.avatar || 'default-avatar.png'; // Use default avatar if none is set

    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.innerHTML = `
      <div class="post-header">
        <img src="${avatar}" class="user-avatar" alt="Avatar">
        <div>
          <h3>${post.user}</h3>
          <small>${new Date(post.timestamp).toLocaleString()}</small>
        </div>
        ${post.user === currentUser  ? 
          `<button class="delete-button" onclick="deletePost('${post.timestamp}')">Delete</button>` : 
          ''}
      </div>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" class="post-image" alt="Post">` : ''}
    `;
    feed.appendChild(postElement);
  });
}

// Function to clear the post form
function clearForm() {
  document.querySelector('.post-input').value = '';
  document.getElementById('imageUpload').value = '';
}

// Logout Logic
if (document.getElementById('logoutButton')) {
  document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser ');
    window.location.href = 'index.html';
  });
}

// New delete post function
function deletePost(timestamp) {
  posts = posts.filter(post => post.timestamp !== timestamp);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// Initial render
if (currentUser ) {
  document.getElementById('loggedInUser ').textContent = currentUser ;
  renderPosts(); // Ensure posts are rendered on initial load
} else {
  window.location.href = 'index.html';
}