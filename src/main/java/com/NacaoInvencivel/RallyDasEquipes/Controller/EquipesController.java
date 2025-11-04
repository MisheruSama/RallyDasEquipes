package com.NacaoInvencivel.RallyDasEquipes.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesResponseDTO;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesRepository;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.EquipesRequestDTO;
import com.NacaoInvencivel.RallyDasEquipes.Equipes.Equipes;

import java.util.List;


@RestController
@RequestMapping("/equipes")
public class EquipesController {
    @Autowired
    private EquipesRepository repository;

@GetMapping
    public List<EquipesResponseDTO> getAll(){
        List<EquipesResponseDTO> equipesList = repository.findAll().stream().map(EquipesResponseDTO::new).toList();
        return equipesList;
    }

@PostMapping
public void saveEquipe(@RequestBody EquipesRequestDTO data){
    Equipes equipesData = new Equipes(data);
    repository.save(equipesData);
    return;

}
@PutMapping("/{id}")
    public void updateEquipe(@PathVariable Long id, @RequestBody EquipesRequestDTO data){
    if(repository.existsById(id)){
        Equipes equipesData = new Equipes(data);
        equipesData.setId(id);
        repository.save(equipesData);
        return;
    }
}
}
