<?php
defined('BASEPATH') or exit('No direct script access allowed');

$route['default_controller']   = 'welcome';
$route['404_override']         = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo']             = 'api/ApiDemoController/index';
 
  // User
$route['user']                        = 'User/index';
$route['login']                       = 'User/login';
$route['user/find/(:any)']            = 'User/find/$1';
$route['user/update/(:any)']          = 'User/update/$1';
$route['user/change_password/(:any)'] = 'User/change_password/$1';
$route['user/delete/(:any)']          = 'User/delete/$1';
  
 

 


// Sanitary Permit
$route['sanitary_permit']       = 'SanitaryPermit/get_all';
$route['sanitary_permit/insert']        = 'SanitaryPermit/insert';
$route['sanitary_permit/find/(:any)']   = 'SanitaryPermit/find/$1';
$route['sanitary_permit/details/(:any)']   = 'SanitaryPermit/details/$1';
$route['sanitary_permit/update/(:any)'] = 'SanitaryPermit/update/$1';
$route['sanitary_permit/delete/(:any)'] = 'SanitaryPermit/delete/$1';
$route['sanitary_permit/bulk_delete/']  = 'SanitaryPermit/bulk_delete/';

$route['sanitary_permit/latest_sp_no']  = 'SanitaryPermit/latest_sp_no/';
