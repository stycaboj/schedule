import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { GroupsService } from '../../core/services/groups.service';
import { GroupModel } from '../../core/models/group.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatSelectModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent implements OnInit {
  public groups = signal<Array<GroupModel>>([]);

  constructor(private readonly groupsService: GroupsService) {}

  public ngOnInit() {
    this.groupsService.get().subscribe((groups) => this.groups.set(groups));
  }

  public get iterableGroups(): GroupModel[] {
    return this.groups();
  }
}