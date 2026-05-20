import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PokedexHeaderComponent } from './pokedex-header.component';

@Component({ template: '', standalone: true })
class ListStubComponent {}

@Component({ template: '', standalone: true })
class DetailStubComponent {}

describe('PokedexHeaderComponent', () => {
  let fixture: ComponentFixture<PokedexHeaderComponent>;
  let component: PokedexHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexHeaderComponent],
      providers: [
        provideRouter([
          {
            path: '',
            component: ListStubComponent,
            data: { hideViewAllButton: true }
          },
          {
            path: 'pokemon/:id',
            component: DetailStubComponent,
            data: { hideViewAllButton: false }
          }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokedexHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide View All on list route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();

    expect(component['isOnPokemonListPage']()).toBeTrue();
  });

  it('should show View All on detail route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/pokemon/1');
    fixture.detectChanges();

    expect(component['isOnPokemonListPage']()).toBeFalse();
  });
});
