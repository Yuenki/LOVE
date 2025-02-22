const spriteA = document.getElementById('spriteA');
const spriteB = document.getElementById('spriteB');
const promptText = document.getElementById('promptText');
const birthdayMessage = document.getElementById('birthdayMessage');
const animationContainer = document.getElementById('animationContainer');
const animationGif = document.getElementById('animationGif');
const overlapSound = document.getElementById('overlapSound'); // Audio element for sound effect

const moveSpeed = 5; // Movement speed
let spriteAPositionX = 0; // Starts at the left edge
let spriteAPositionY = document.querySelector('.container').clientHeight / 2 - spriteA.clientHeight / 2; // Starts at the vertical center
let isNearB = false;
let isAnimationPlaying = false; // Track if animation is playing
let animationInterval = null; // Track the animation interval
let hasPlayedSound = false; // Track if the sound has been played

// Velocity for smooth movement
let velocityX = 0;
let velocityY = 0;

// Key states for movement
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Update sprite position
function updateSpritePosition() {
  const containerRect = document.querySelector('.container').getBoundingClientRect();
  const spriteARect = spriteA.getBoundingClientRect();

  // Calculate new position
  spriteAPositionX += velocityX;
  spriteAPositionY += velocityY;

  // Contain sprite within the box
  spriteAPositionX = Math.max(0, Math.min(containerRect.width - spriteARect.width, spriteAPositionX));
  spriteAPositionY = Math.max(0, Math.min(containerRect.height - spriteARect.height, spriteAPositionY));

  // Apply new position
  spriteA.style.left = `${spriteAPositionX}px`;
  spriteA.style.top = `${spriteAPositionY}px`;

  // Check overlap with Sprite B
  checkOverlap();

  // Stop animation if player moves
  if (isAnimationPlaying && (velocityX !== 0 || velocityY !== 0)) {
    stopAnimation();
  }

  // Request next frame
  requestAnimationFrame(updateSpritePosition);
}

// Check if Sprite A and Sprite B overlap by at least 10%
function checkOverlap() {
  const spriteARect = spriteA.getBoundingClientRect();
  const spriteBRect = spriteB.getBoundingClientRect();

  // Calculate the overlap area
  const overlapX = Math.max(0, Math.min(spriteARect.right, spriteBRect.right) - Math.max(spriteARect.left, spriteBRect.left));
  const overlapY = Math.max(0, Math.min(spriteARect.bottom, spriteBRect.bottom) - Math.max(spriteARect.top, spriteBRect.top));
  const overlapArea = overlapX * overlapY;

  // Calculate Sprite A's area
  const spriteAArea = spriteARect.width * spriteARect.height;

  // Check if overlap is at least 10% of Sprite A's area
  if (overlapArea >= 0.1 * spriteAArea) {
    if (!isNearB) {
      isNearB = true;
      promptText.classList.remove('hidden'); // Show prompt

      // Play sound effect if it hasn't been played yet
      if (!hasPlayedSound) {
        overlapSound.play(); // Play the sound
        hasPlayedSound = true; // Mark the sound as played
      }
    }
  } else {
    if (isNearB) {
      isNearB = false;
      promptText.classList.add('hidden'); // Hide prompt
      birthdayMessage.classList.add('hidden'); // Hide birthday message
      hasPlayedSound = false; // Reset the sound flag when no longer overlapping
    }
  }
}

// Handle keydown events
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': keys.w = true; velocityY = -moveSpeed; break;
    case 'a': keys.a = true; velocityX = -moveSpeed; break;
    case 's': keys.s = true; velocityY = moveSpeed; break;
    case 'd': keys.d = true; velocityX = moveSpeed; break;
    case 'f': if (isNearB) showBirthdayMessage(); break; // Show birthday message on F press
  }
});

// Handle keyup events
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w': keys.w = false; if (!keys.s) velocityY = 0; break;
    case 'a': keys.a = false; if (!keys.d) velocityX = 0; break;
    case 's': keys.s = false; if (!keys.w) velocityY = 0; break;
    case 'd': keys.d = false; if (!keys.a) velocityX = 0; break;
  }
});

// Show birthday message
function showBirthdayMessage() {
  promptText.classList.add('hidden');
  birthdayMessage.classList.remove('hidden');
  playAnimation('kiss'); // Play kiss animation
}

// Play animation based on selection
function playAnimation(action) {
  const gifMap = {
    kiss: 'kiss.gif',
  };

  animationGif.src = gifMap[action];
  animationContainer.classList.remove('hidden');

  // Hide animation after 3 seconds
  setTimeout(() => {
    animationContainer.classList.add('hidden');
  }, 3000);
}

// Stop the animation
function stopAnimation() {
  if (isAnimationPlaying) {
    clearInterval(animationInterval); // Stop the loop
    animationContainer.classList.add('hidden');
    isAnimationPlaying = false;
  }
}

// Start the game loop
updateSpritePosition();