<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SanitaryPermit extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SanitaryPermitModel'); 
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new SanitaryPermitModel;  
		$result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$model = new SanitaryPermitModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
	 
		$data = array(
			'classification' => $requestData['classification'],
			'business' => $requestData['business'],
			'owner' => $requestData['owner'],
			'address' => $requestData['address'],
			'sp_no' => $requestData['sp_no'],
			'encoded_by' => $requestData['encoded_by'],
		);

		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Certificate Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create certificate.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$model = new SanitaryPermitModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}
	 
	public function update_put($id)
	{


		$model = new SanitaryPermitModel;

		$requestData = json_decode($this->input->raw_input_stream, true);



		$data = array(
			'id' => $id,
			'classification' => $requestData['classification'],
			'business' => $requestData['business'],
			'owner' => $requestData['owner'],
			'address' => $requestData['address'],
		);
		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Certificate Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update certificate'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new SanitaryPermitModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Certificate Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete certificate.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

 

	function latest_sp_no_get()
	{
		$model = new SanitaryPermitModel;
		$result = $model->latestSpNo();
		$data = $result ?
			['sp_no' => (int) $result->sp_no + 1] :
			['sp_no' => 1];
		$this->response($data, RestController::HTTP_OK);
	}


}
