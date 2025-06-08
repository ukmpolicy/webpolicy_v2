<?php

namespace App\Http\Controllers;

use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $roles = $this->roleService->getAllRoles();
        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name',
        ]);
        $this->roleService->createRole($data);
        return redirect()->back()->with('success', 'Role created!');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
        ]);
        $this->roleService->updateRole($id, $data);
        return redirect()->back()->with('success', 'Role updated!');
    }

    public function destroy($id)
    {
        $this->roleService->deleteRole($id);
        return redirect()->back()->with('success', 'Role deleted!');
    }
}
