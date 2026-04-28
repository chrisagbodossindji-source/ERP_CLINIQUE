<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tarif;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@clinique.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $tarifs = [
            ['designation' => 'Consultation générale', 'categorie' => 'Consultation', 'prix' => 3000],
            ['designation' => 'Consultation spécialisée', 'categorie' => 'Consultation', 'prix' => 5000],
            ['designation' => 'Prise de constantes', 'categorie' => 'Soin', 'prix' => 1000],
            ['designation' => 'Injection', 'categorie' => 'Soin', 'prix' => 500],
            ['designation' => 'Perfusion', 'categorie' => 'Soin', 'prix' => 2000],
            ['designation' => 'Pansement simple', 'categorie' => 'Soin', 'prix' => 1500],
            ['designation' => 'Pansement complexe', 'categorie' => 'Soin', 'prix' => 3000],
            ['designation' => 'Suture', 'categorie' => 'Soin', 'prix' => 5000],
            ['designation' => 'Radiographie', 'categorie' => 'Examen', 'prix' => 10000],
            ['designation' => 'Echographie', 'categorie' => 'Examen', 'prix' => 15000],
            ['designation' => 'Analyse sanguine', 'categorie' => 'Analyse', 'prix' => 5000],
            ['designation' => 'Numération formule', 'categorie' => 'Analyse', 'prix' => 3500],
            ['designation' => 'Glycémie', 'categorie' => 'Analyse', 'prix' => 2000],
            ['designation' => 'Test paludisme', 'categorie' => 'Analyse', 'prix' => 2500],
            ['designation' => 'Certificat médical', 'categorie' => 'Document', 'prix' => 2000],
            ['designation' => 'Certificat aptitude', 'categorie' => 'Document', 'prix' => 3000],
            ['designation' => 'Ordonnance', 'categorie' => 'Document', 'prix' => 500],
            ['designation' => 'Vaccination', 'categorie' => 'Soin', 'prix' => 2000],
            ['designation' => 'Soins infirmiers', 'categorie' => 'Soin', 'prix' => 1000],
            ['designation' => 'Garde malade', 'categorie' => 'Service', 'prix' => 5000],
        ];

        foreach ($tarifs as $tarif) {
            Tarif::create($tarif);
        }
    }
}
