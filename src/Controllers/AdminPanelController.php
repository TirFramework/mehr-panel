<?php

namespace Tir\mehrPanel\Controllers;

use App\Http\Controllers\Controller;

class AdminController extends Controller
{

    public function general()
    {
        return (object)[
            'name' => config('app.name'),
        ];
    }
}