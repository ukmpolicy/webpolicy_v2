<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'Dashboard', 'key' => 'dashboard'],
            ['name' => 'Roles', 'key' => 'roles'],
            ['name' => 'Permissions', 'key' => 'permissions'],
            ['name' => 'Periods', 'key' => 'periods'],
            ['name' => 'Members', 'key' => 'members'],
            ['name' => 'Divisions', 'key' => 'divisions'],
            ['name' => 'Division Plans', 'key' => 'division-plans'],
            ['name' => 'Structures', 'key' => 'structures'],
            ['name' => 'Structure Members', 'key' => 'structure-members'],
            ['name' => 'Gallery Album', 'key' => 'gallery-album'],
            ['name' => 'Gallery Media', 'key' => 'gallery-media'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['key' => $permission['key']], $permission);
        }
    }
}
