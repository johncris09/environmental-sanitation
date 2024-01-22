<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SanitaryPermitModel extends CI_Model
{

	public $table = 'sanitary_permit';

	public function getAll()
	{
		$query = $this->db->select('
		sanitary_permit.id,
		sp_no, classification,
		business, owner, address, timestamp,
		name as encoded_by
		 
		') 
			->where('sanitary_permit.encoded_by = users.id')
			->order_by('sp_no', 'desc')
			->get('sanitary_permit, users');
		return $query->result();
	}
 
	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


	public function bulk_delete($data)
	{
		$this->db->where_in('id', $data);
		return $this->db->delete($this->table);
	}

	public function latestSpNo()
    {
        $query =  $this->db
            ->where('YEAR(timestamp)', date('Y'))
            ->order_by('sp_no', 'desc')
			->get($this->table);  
		return $query->row();  
    }

}