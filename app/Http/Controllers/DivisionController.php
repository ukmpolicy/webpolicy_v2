<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends Controller
{
    public function index(){

        $divisions = Division::all();

        return Inertia::render("divisions/index", [
            "division" => $divisions
        ]);
    }
}
