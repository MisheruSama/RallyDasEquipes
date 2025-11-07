package com.NacaoInvencivel.RallyDasEquipes.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NacaoInvencivel.RallyDasEquipes.Equipes.Equipes;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesRepository;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesRequestDTO;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesResponseDTO;


@RestController
@RequestMapping("/equipes")
public class EquipesController {
    @Autowired
    private EquipesRepository repository;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@GetMapping
    public List<EquipesResponseDTO> getAll(){
        List<EquipesResponseDTO> equipesList = repository.findAll().stream().map(EquipesResponseDTO::new).toList();
        return equipesList;
    }

@PostMapping("/cadastrar")
public void saveEquipe(@RequestBody EquipesRequestDTO data){
    Equipes equipesData = new Equipes(data);
    repository.save(equipesData);

}
@PutMapping("/atualizar/{id}")
    public void updateEquipe(@PathVariable Long id, @RequestBody EquipesRequestDTO data){
    if(repository.existsById(id)){
        Equipes equipesData = new Equipes(data);
        equipesData.setId(id);
        repository.save(equipesData);
    }
}

@DeleteMapping("/excluir/{id}")
    public void deleteEquipe(@PathVariable Long id){
    if(repository.existsById(id)){
        repository.deleteById(id);
    }
}
}
