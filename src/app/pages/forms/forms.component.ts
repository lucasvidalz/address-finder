import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViacepService } from '../../_services/viacep.service';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit {

  constructor(private fb: FormBuilder, private viacepService: ViacepService) { }//novamente injentando dependencia
  
  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm();
    this.ObserveFillCep();
  }

  initializeForm() {
    this.form = this.fb.group({
      cep: ['', [Validators.required]],
      logradouro: [{value: '', disabled: true}],
      bairro: [{value: '', disabled: true}],
      cidade: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}]
  })
}

ObserveFillCep(){
  this.form.get('cep')?.valueChanges.subscribe(value => {
      if(value?.length === 8){
          this.getCep();
      }
  })
}

getCep(){
  var cep = this.form.get('cep')?.value;
  this.viacepService.getEnderecoByCep(cep).subscribe(
    {  
      next: (response) => {
        this.form.patchValue({
          logradouro: response.logradouro,
          bairro: response.bairro,
          cidade: response.localidade,
          estado: response.uf
      })
    },
      error: () => {
        console.log("Erro ao buscar CEP");
      }

  })

}
}