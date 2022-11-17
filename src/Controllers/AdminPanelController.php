<?php

namespace Tir\MehrPanel\Controllers;

use App\Http\Controllers\Controller;

class AdminPanelController extends Controller
{

    public function general()
    {
        return (object)[
            'name' => config('app.name'),
        ];
    }
}