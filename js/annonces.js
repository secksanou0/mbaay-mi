// Version SIMPLIFIÉE de annonces.js pour test
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ annonces.js chargé !");
    
    // Remplir les annonces
    remplirAnnonces();
    
    // Bouton s'abonner
    const btnSubscribe = document.getElementById('subscribe-btn');
    if (btnSubscribe) {
        console.log("✅ Bouton trouvé !");
        btnSubscribe.addEventListener('click', function() {
            alert("✅ Bouton cliqué ! Abonnement réussi !");
            
            // Incrémenter le compteur
            const subsSpan = document.getElementById('current-subs');
            if (subsSpan) {
                let count = parseInt(subsSpan.textContent) || 245;
                subsSpan.textContent = count + 1;
            }
        });
    } else {
        console.log("❌ Bouton NON trouvé !");
    }
});

function remplirAnnonces() {
    const container = document.getElementById('annonces-container');
    if (!container) return;
    
    const annonces = [
        {
            id: 1,
            title: "Vente de riz",
            category: "vente",
            description: "Riz de qualité",
            region: "dakar",
            price: "25000 FCFA",
            seller: "Coopérative",
            date: "2024-01-15"
        },
        {
            id: 2,
            title: "Recherche ouvriers",
            category: "emploi",
            description: "Pour récolte",
            region: "thies",
            price: "5000 FCFA/jour",
            seller: "Ferme Moderne",
            date: "2024-01-14"
        }
    ];
    
    container.innerHTML = '';
    annonces.forEach(annonce => {
        const card = document.createElement('div');
        card.className = 'annonce-card';
        card.innerHTML = `
            <div class="annonce-header">
                <span class="annonce-category ${annonce.category}">${annonce.category}</span>
                <h3>${annonce.title}</h3>
            </div>
            <div class="annonce-body">
                <p>${annonce.description}</p>
            </div>
            <div class="annonce-footer">
                <div class="annonce-price">${annonce.price}</div>
                <button class="btn-contact" onclick="alert('Contact: 78 123 45 67')">
                    Contacter
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}