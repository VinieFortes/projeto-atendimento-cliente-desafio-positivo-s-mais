import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatosListComponent } from './contatos-list.component';

describe('ContatosListComponent', () => {
  let component: ContatosListComponent;
  let fixture: ComponentFixture<ContatosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContatosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
