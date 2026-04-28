<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = [
            [
                'name' => 'admin',
                'label' => 'Administrateur',
                'description' => 'Accès total au système',
                'permissions' => ['Gérer utilisateurs', 'Voir stats', 'Gérer tarifs', 'Gérer assurances']
            ],
            [
                'name' => 'medecin',
                'label' => 'Médecin',
                'description' => 'Gestion médicale des patients',
                'permissions' => ['Consulter dossiers', 'Remplir dossiers', 'Prescrire ordonnances', 'Émettre certificats']
            ],
            [
                'name' => 'infirmier',
                'label' => 'Infirmier',
                'description' => 'Prise en charge initiale',
                'permissions' => ['Prendre constantes', 'Voir liste attente', 'Consulter dossier de base']
            ],
            [
                'name' => 'receptionniste',
                'label' => 'Réceptionniste',
                'description' => 'Accueil et enregistrement',
                'permissions' => ['Enregistrer patients', 'Créer consultations', 'Gérer planning']
            ],
            [
                'name' => 'caissier',
                'label' => 'Caissier',
                'description' => 'Gestion des encaissements',
                'permissions' => ['Émettre factures', 'Enregistrer paiements', 'Voir factures impayées']
            ],
            [
                'name' => 'comptable',
                'label' => 'Comptable',
                'description' => 'Gestion financière',
                'permissions' => ['Normaliser factures', 'Voir stats financières', 'Gérer remboursements']
            ],
        ];

        return response()->json($roles);
    }
}
