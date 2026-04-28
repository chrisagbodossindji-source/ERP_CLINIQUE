<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use Carbon\Carbon;

class PatientImportSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['Dupont', 'Lucas', '22/07/1992', 'M', '07 23 45 67 89', 'Célibataire', 'Ingénieur informaticien', '8 avenue de la Gare, 69003 Lyon'],
            ['Bernard', 'Émilie', '03/11/1978', 'F', '06 34 56 78 90', 'Divorcé(e)', 'Enseignante', '15 bis rue Victor Hugo, 13001 Marseille'],
            ['Dubois', 'Thomas', '19/09/1980', 'M', '06 45 67 89 01', 'Marié(e)', 'Plombier', '24 chemin des Peupliers, 33000 Bordeaux'],
            ['Petit', 'Julie', '27/05/1995', 'F', '07 56 78 90 12', 'Célibataire', 'Étudiante', '3 place de la Mairie, 59000 Lille'],
            ['Robert', 'Nicolas', '08/12/1973', 'M', '06 67 89 01 23', 'Veuf/Veuve', 'Chauffeur routier', '42 rue Voltaire, 67000 Strasbourg'],
            ['Richard', 'Camille', '14/02/1988', 'F', '07 78 90 12 34', 'Marié(e)', 'Avocate', '9 square Gambetta, 44000 Nantes'],
            ['Durand', 'Antoine', '30/06/1990', 'M', '06 89 01 23 45', 'Célibataire', 'Boulanger', '17 rue Nationale, 31000 Toulouse'],
            ['Moreau', 'Laura', '25/10/1982', 'F', '06 90 12 34 56', 'Célibataire', 'Infirmière', '5 allée des Roses, 34000 Montpellier'],
            ['Simon', 'Jérémy', '11/04/1998', 'M', '07 01 23 45 67', 'Célibataire', 'Électricien', '18 rue Pasteur, 76000 Rouen'],
            ['Laurent', 'Pauline', '17/08/1975', 'F', '06 12 34 56 78', 'Divorcé(e)', 'Commerciale', '29 boulevard Wilson, 06000 Nice'],
            ['Lefebvre', 'Kevin', '03/01/1989', 'M', '06 23 45 67 89', 'Marié(e)', 'Pompier', '36 rue de la Paix, 51100 Reims'],
            ['Garcia', 'Marie', '21/09/1993', 'F', '07 34 56 78 90', 'Célibataire', 'Architecte', '14 impasse des Jardins, 29200 Brest'],
            ['Michel', 'David', '12/06/1970', 'M', '06 45 67 89 01', 'Marié(e)', 'Retraité', '7 clos du Château, 37000 Tours'],
            ['Garcia', 'Laura', '05/05/2000', 'F', '06 56 78 90 12', 'Célibataire', 'Vendeuse', '21 rue du Commerce, 94000 Créteil'],
        ];

        foreach ($data as $row) {
            Patient::create([
                'nom' => $row[0],
                'prenom' => $row[1],
                'date_naissance' => Carbon::createFromFormat('d/m/Y', $row[2])->format('Y-m-d'),
                'sexe' => $row[3],
                'telephone' => $row[4],
                'situation_matrimoniale' => $row[5],
                'profession' => $row[6],
                'adresse' => $row[7],
            ]);
        }
    }
}
