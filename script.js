// ---------- Smooth scroll pour ancres (initialisation plus bas) ----------
/**
 * script.js
 * Explications en français pour chaque bloc :
 * - Menu hamburger : ouverture/fermeture du menu mobile
 * - Fermeture du menu au clic sur un lien ou à l'extérieur
 * - Gestion responsive simple (affichage/masquage de l'image et des animations)
 * - Smooth scroll pour les ancres
 */

// Sélection des éléments principaux
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

// ---------- Menu hamburger ----------
// Lorsqu'on clique sur le bouton hamburger, on ajoute/enlève la classe 'active'
// qui déclenche l'affichage du menu mobile (géré en CSS par .nav-links.active)
if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', (e) => {
        // Empêche la propagation pour éviter la fermeture immédiate par le listener global
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // ---------- Fermer le menu au clic sur un lien ----------
    // Pour une meilleure UX, lorsqu'un utilisateur choisit une option, on ferme le menu.
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ---------- Fermer le menu en cliquant à l'extérieur ----------
    // Si l'utilisateur clique hors de la navbar, on ferme le menu (comportement courant sur mobile).
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && !e.target.closest('.hamburger-menu')) {
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ---------- Gestion responsive simple (JS) ----------
// Le JavaScript complète le CSS en masquant dynamiquement certains éléments
// pour améliorer la performance et l'affichage sur petits écrans.
function handleResize() {
    const width = window.innerWidth;
    const heroImage = document.querySelector('.hero-image');
    const animatedBg = document.querySelectorAll('.animated-background');
    const heroSection = document.querySelector('.hero-section');

    if (width <= 768) {
        // Mobile : on cache la photo et les animations pour alléger
        if (heroImage) heroImage.style.display = 'none';
        animatedBg.forEach(bg => bg.style.display = 'none');
        if (heroSection) heroSection.style.minHeight = 'auto';
    } else {
        // Desktop : on restaure l'affichage
        if (heroImage) heroImage.style.display = 'block';
        animatedBg.forEach(bg => bg.style.display = 'block');
        if (heroSection) heroSection.style.minHeight = '700px';
    }
}

// Exécution au chargement et au redimensionnement de la fenêtre
window.addEventListener('load', handleResize);
window.addEventListener('resize', handleResize);

// ---------- Smooth scroll pour ancres ----------
// Ce bloc active le défilement fluide lorsqu'on clique sur un lien d'ancrage (#...)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Utilisation de scrollIntoView pour un comportement natif et fluide
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Fermer le menu mobile si ouvert (utile sur mobile)
            if (hamburgerMenu && navLinks) {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });
});
// fin du script

/*
 * Animation pour `job1` et `job2` :
 * - affiche lettre par lettre
 * - efface lettre par lettre de droite à gauche
 * - alterne les deux textes en boucle
 */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function cycleJobTitles() {
    // sélection du h3 existant (ex: <h3 class="job1">Texte1<span class="job2">Texte2</span></h3>)
    const h3 = document.querySelector('h3.job1');
    if (!h3) return;

    // récupérer le texte du noeud texte (avant le span) et celui du span.job2
    const job1Text = (h3.childNodes[0] && h3.childNodes[0].textContent) ? h3.childNodes[0].textContent.trim() : '';
    const spanJob2 = h3.querySelector('.job2');
    const job2Text = spanJob2 ? spanJob2.textContent.trim() : '';

    // remplacer le contenu par un conteneur pour l'animation
    h3.innerHTML = '<span class="job-anim"></span>';
    const target = h3.querySelector('.job-anim');

    const texts = [job1Text, job2Text].filter(t => t.length > 0);
    if (texts.length === 0) return;

    const typingDelay = 80;
    const deletingDelay = 60;
    const pauseAfterTyping = 900;

    let index = 0;
    while (true) {
        const text = texts[index % texts.length];

        // taper lettre par lettre (gauche -> droite)
        for (let i = 1; i <= text.length; i++) {
            target.textContent = text.slice(0, i);
            await sleep(typingDelay);
        }

        await sleep(pauseAfterTyping);

        // effacer lettre par lettre en partant de la fin (droite -> gauche)
        for (let i = text.length; i >= 0; i--) {
            target.textContent = text.slice(0, i);
            await sleep(deletingDelay);
        }

        await sleep(300);
        index++;
    }
}

// démarrer l'animation au chargement
window.addEventListener('load', cycleJobTitles);

/*
 * Animation des barres de compétences
 * - utilise IntersectionObserver pour animer les `.skill-fill` lorsque la section devient visible
 * - lit la valeur cible depuis l'attribut `data-fill` (pourcentage)
 */
function animateSkillBarsOnView() {
    const fills = document.querySelectorAll('.skill-fill[data-fill]');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fills.forEach(fill => {
                    const value = fill.getAttribute('data-fill') || '0';
                    // animer la largeur
                    fill.style.width = value + '%';
                });
                // une fois animées, on n'a plus besoin de l'observer
                obs.disconnect();
            }
        });
    }, { threshold: 0.25 });

    // observer la section skills si elle existe, sinon observer le premier fill
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) observer.observe(skillsSection);
    else if (fills[0]) observer.observe(fills[0]);
}

window.addEventListener('load', animateSkillBarsOnView);

/* Filtrage des projets */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('filter-active'));
            btn.classList.add('filter-active');
            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = (filter === 'all' && category === 'all') || (filter === 'design' && category === 'design');
                if (shouldShow) {
                    card.classList.remove('hidden');
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                }
            });
        });
    });
}

// ---------- Gestion du modal pour les projets Web ----------
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const projectClickables = document.querySelectorAll('.project-clickable');

// Données des projets Web
const projectsData = {
    web1: {
        title: 'Harmy\'Sewing',
        tech: 'HTML • CSS • JavaScript',
        description: 'Harmy\'Sewing est un site web moderne et responsive conçu pour présenter les services de couture de Harmy. Le site met en avant les différentes prestations offertes, telles que la confection sur mesure, les retouches et les créations personnalisées. Avec une interface conviviale et un design attrayant, Harmy\'Sewing vise à attirer une clientèle variée en mettant en valeur le savoir-faire et la créativité de Harmy dans le domaine de la couture.',
        image: 'asset/image/Harmy.png',
        link: 'https://harmy-xi.vercel.app/'
    },
    web2: {
        title: 'EkaPlace',
        tech: 'HTML • CSS • JAVASCRIPT • PHP',
        description: 'EkaPlace est une plateforme incountournable pourr trouver facilement votre maison ou appartement à louer à Bukavu. Conçu spécifiquement pour le marché local, ce site met en relation directe les locataires pressés avec les propriètaires, éliminant ainsi les intermédiaires coûteux. Avec une interface conviviale et des fonctionnalités de recherche avancées, EkaPlace simplifie le processus de location immobilière à Bukavu.',
        image: 'asset/image/Screenshot_20251216-222702.png',
        link: 'https://ekaplace.revue-critique.com/'
    }
};

// Ouvrir le modal au clic sur une image Web
projectClickables.forEach(clickable => {
    clickable.addEventListener('click', () => {
        const projectId = clickable.getAttribute('data-project-id');
        const project = projectsData[projectId];
        
        if (project) {
            document.getElementById('modalImage').src = project.image;
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalTech').textContent = project.tech;
            document.getElementById('modalDesc').textContent = project.description;
            document.getElementById('modalLink').href = project.link;
            
            projectModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page
        }
    });
});

// Fermer le modal au clic sur le bouton close
modalClose.addEventListener('click', closeProjectModal);

// Fermer le modal au clic sur le backdrop
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeProjectModal();
    }
});

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('show')) {
        closeProjectModal();
    }
});

// Fonction pour fermer le modal
function closeProjectModal() {
    projectModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurer le scroll
}

// ---------- Formulaire de contact via WhatsApp ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const message = document.getElementById('userMessage').value;
        
        // Construire le message WhatsApp
        const whatsappText = `Bonjour,\n\nNom: ${name}\nEmail: ${email}\n\nDécription du projet:\n${message}`;
        const whatsappMessage = encodeURIComponent(whatsappText);
        
        // Numéro WhatsApp (sans espaces, avec code pays)
        const phoneNumber = '243854832846';
        
        // Afficher le message de succès
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        
        // Rediriger vers WhatsApp après un court délai
        setTimeout(() => {
            window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
        }, 500);
        
        // Réinitialiser le formulaire
        setTimeout(() => {
            contactForm.reset();
            successMessage.style.display = 'none';
        }, 2000);
    });
}

window.addEventListener('load', initProjectFilters);