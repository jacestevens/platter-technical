
document.addEventListener('DOMContentLoaded', () => {

      
            
            let expandButton = document.querySelector('.expand-button');
            let cardContainer = document.querySelector('.product-card--wrapper');

            if (!expandButton || !cardContainer) return;

            const syncCollapsedCardAccessibility = (isExpanded) => {
                const cards = cardContainer.querySelectorAll('.product-card');
                cards.forEach((card, index) => {
                    const isCollapsible = index >= 4;
                    if (!isCollapsible) return;

                    const shouldHide = !isExpanded;
                    card.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
                });
            };

            const checkContainerHeight = () => {
                let scrollHeight = cardContainer.scrollHeight;
                window.addEventListener('resize', () => {
                    scrollHeight = cardContainer.scrollHeight;
                    cardContainer.style.setProperty('--expanded-height', scrollHeight + 'px');
                });
            };
            checkContainerHeight();

            const setExpandedState = (expanded) => {
                cardContainer.dataset.expanded = expanded ? 'true' : 'false';
                expandButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                expandButton.textContent = expanded ? 'Show Less' : 'Show More';
                syncCollapsedCardAccessibility(expanded);
            };

            const expandSection = () => {
                const expanded = cardContainer.dataset.expanded !== 'true';
                setExpandedState(expanded);
            };

            expandButton.addEventListener('click', expandSection);

            if (!cardContainer.id) {
                cardContainer.id = 'best-sellers';
            }
            expandButton.setAttribute('aria-controls', cardContainer.id);
            setExpandedState(cardContainer.dataset.expanded === 'true');


            let addToCartButtons = document.querySelectorAll('.platter-quick-add');

            // Add to Cart Functions

            function addItemToCart(variant_id, qty, el) {
            const data = { id: variant_id, quantity: qty };

            fetch("/cart/add.js", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "same-origin",
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`Cart add failed: ${res.status}`);
                    return res.json();
                })
                .then(() => {
                   el.innerHTML = 'Added!';
                   el.classList.add('added');
                   setTimeout(() => {
                       el.innerHTML = 'Add to Cart';
                       el.classList.remove('added');
                   }, 1000);
                })
                
                .catch((err) => {
                console.error(err);
                });
            }
            
            addToCartButtons.forEach((button) => {
                let variantId = button.dataset.productAtc;
                button.addEventListener('click', () => {
                    addItemToCart(variantId, 1, button);

                });
            });
            
});
