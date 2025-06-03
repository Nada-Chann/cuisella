<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    public function index()
    {
        $paginated = Recipe::with('user')->latest()->paginate(9);
        return response()->json($paginated);
    }

    public function popular()
    {
        $recipes = Recipe::with('user')->latest()->limit(6)->get();
        return response()->json($recipes);
    }

    public function show($id)
    {
        $recipe = Recipe::with('user')->findOrFail($id);
        return response()->json($recipe);
    }

    public function userRecipes(Request $request)
    {
        $recipes = $request->user()->recipes()->latest()->get();
        return response()->json($recipes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'time'        => 'nullable|string|max:100',
            'servings'    => 'nullable|integer',
            'ingredients' => 'required|json',
            'steps'       => 'required|json',
            'image'       => 'nullable|image|max:2048',
        ]);

        // Convert JSON strings to arrays
        $data['ingredients'] = json_decode($data['ingredients'], true);
        $data['steps'] = json_decode($data['steps'], true);
        
        $data['user_id'] = $request->user()->id;
        
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('recipe-images', 'public');
        }

        $recipe = Recipe::create($data);
        return response()->json($recipe, 201);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'time'        => 'nullable|string|max:100',
            'servings'    => 'nullable|integer',
            'ingredients' => 'required|json',
            'steps'       => 'required|json',
            'image'       => 'nullable|image|max:2048',
        ]);

        // Convert JSON strings to arrays
        $data['ingredients'] = json_decode($data['ingredients'], true);
        $data['steps'] = json_decode($data['steps'], true);

        if ($request->hasFile('image')) {
            if ($recipe->image_path) {
                Storage::disk('public')->delete($recipe->image_path);
            }
            $data['image_path'] = $request->file('image')->store('recipe-images', 'public');
        }

        $recipe->update($data);
        return response()->json($recipe);
    }

    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted']);
    }
}