document.addEventListener('DOMContentLoaded', function () {
  const starContainer = document.querySelector('.star-rating');
  if (!starContainer) return;

  const stars = Array.from(starContainer.querySelectorAll('.star'));
  const hiddenInput = document.querySelector('input[name="review[rating]"]');
  let currentRating = Number(hiddenInput.value) || 0;
  
  // Detect if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function setVisual(rating) {
    stars.forEach((s, idx) => {
      if (idx < rating) {
        s.classList.remove('far');
        s.classList.add('fas', 'text-warning');
      } else {
        s.classList.remove('fas', 'text-warning');
        s.classList.add('far');
      }
    });
  }

  // initialize
  setVisual(currentRating);

  stars.forEach((star, idx) => {
    const starValue = idx + 1;
    
    // Enhanced touch support for mobile
    if (isTouchDevice) {
      // Use touch events for better mobile experience
      star.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setVisual(starValue);
      });
      
      star.addEventListener('touchend', (e) => {
        e.preventDefault();
        currentRating = starValue;
        hiddenInput.value = currentRating;
        setVisual(currentRating);
      });
      
      // Add haptic feedback if available
      star.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate(50); // Short vibration feedback
        }
        currentRating = starValue;
        hiddenInput.value = currentRating;
        setVisual(currentRating);
      });
    } else {
      // Desktop hover behavior
      star.addEventListener('mouseenter', () => setVisual(starValue));
      star.addEventListener('mouseleave', () => setVisual(currentRating));
      star.addEventListener('click', () => {
        currentRating = starValue;
        hiddenInput.value = currentRating;
        setVisual(currentRating);
      });
    }
    
    // Enhanced keyboard support
    star.setAttribute('tabindex', 0);
    star.setAttribute('role', 'button');
    star.setAttribute('aria-label', `Rate ${starValue} star${starValue > 1 ? 's' : ''}`);
    
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        star.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowRight' && idx < stars.length - 1) {
        e.preventDefault();
        stars[idx + 1].focus();
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        stars[idx - 1].focus();
      }
    });
  });
});
