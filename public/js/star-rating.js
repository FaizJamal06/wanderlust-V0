document.addEventListener('DOMContentLoaded', function () {
  const starContainer = document.querySelector('.star-rating');
  if (!starContainer) return;

  const stars = Array.from(starContainer.querySelectorAll('.star'));
  const hiddenInput = document.querySelector('input[name="review[rating]"]');
  let currentRating = Number(hiddenInput.value) || 0;

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
    star.addEventListener('mouseenter', () => setVisual(starValue));
    star.addEventListener('mouseleave', () => setVisual(currentRating));
    star.addEventListener('click', () => {
      currentRating = starValue;
      hiddenInput.value = currentRating;
      setVisual(currentRating);
    });
    // keyboard support
    star.setAttribute('tabindex', 0);
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        star.click();
      }
    });
  });
});
