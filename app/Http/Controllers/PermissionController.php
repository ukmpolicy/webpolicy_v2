<?php

namespace App\Http\Controllers;

use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    protected $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function index()
    {
        $permissions = $this->permissionService->getAllPermissionsPaginated();
        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'key' => 'required|string|max:50|unique:permissions,key|regex:/^[a-z0-9\-]+$/',
            'description' => 'nullable|string|max:255',
        ]);
        $this->permissionService->createPermission($data);
        return redirect()->back()->with('success', 'Permission created!');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'key' => "required|string|max:50|unique:permissions,key,{$id}|regex:/^[a-z0-9\-]+$/",
            'description' => 'nullable|string|max:255',
        ]);
        $this->permissionService->updatePermission($id, $data);
        return redirect()->back()->with('success', 'Permission updated!');
    }

    public function destroy($id)
    {
        $this->permissionService->deletePermission($id);
        return redirect()->back()->with('success', 'Permission deleted!');
    }
}
