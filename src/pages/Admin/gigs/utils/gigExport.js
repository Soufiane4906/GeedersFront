import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Fonction pour générer un PDF des gigs
export const generateGigsPDF = (gigs) => {
    const doc = new jsPDF();

    // Ajouter le titre
    doc.setFontSize(18);
    doc.text('Liste des Ambassadeurs', 14, 22);

    // Préparer les données pour le tableau
    const tableColumn = ["Titre", "Ambassadeur", "Pays", "Ville", "Prix", "Ventes", "Statut"];
    const tableRows = [];

    gigs.forEach(gig => {
        const gigData = [
            gig.title.substring(0, 25) + (gig.title.length > 25 ? '...' : ''),
            gig.username,
            gig.country,
            gig.city,
            `$${gig.price}`,
            gig.sales,
            gig.active ? 'Actif' : 'Inactif'
        ];
        tableRows.push(gigData);
    });

    // Générer le tableau
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 20 }
        }
    });

    // Ajouter la date d'exportation
    const date = new Date();
    doc.setFontSize(10);
    doc.text(`Exporté le ${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`, 14, doc.lastAutoTable.finalY + 10);

    // Télécharger le PDF
    doc.save(`ambassadeurs_${date.toISOString().split('T')[0]}.pdf`);
};

// Fonction pour générer un fichier Excel des gigs
export const generateGigsExcel = (gigs) => {
    // Préparer les données
    const worksheet = XLSX.utils.json_to_sheet(
        gigs.map(gig => ({
            'Titre': gig.title,
            'Ambassadeur': gig.username,
            'Pays': gig.country,
            'Ville': gig.city,
            'Prix': gig.price,
            'Ventes': gig.sales,
            'Date de création': new Date(gig.createdAt).toLocaleDateString(),
            'Statut': gig.active ? 'Actif' : 'Inactif',
            'En vedette': gig.featured ? 'Oui' : 'Non'
        }))
    );

    // Ajuster la largeur des colonnes
    const colWidths = [
        { wch: 40 }, // Titre
        { wch: 20 }, // Ambassadeur
        { wch: 15 }, // Pays
        { wch: 15 }, // Ville
        { wch: 10 }, // Prix
        { wch: 10 }, // Ventes
        { wch: 15 }, // Date
        { wch: 10 }, // Statut
        { wch: 10 }  // En vedette
    ];
    worksheet['!cols'] = colWidths;

    // Créer le workbook et ajouter la feuille
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ambassadeurs');

    // Générer le fichier et le télécharger
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `ambassadeurs_${date}.xlsx`);
};
