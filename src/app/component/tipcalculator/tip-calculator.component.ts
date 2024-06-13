import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { TipCalulatorService } from './shared/tip-calculator.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tip-calculator',
  templateUrl: './tip-calculator.component.html',
  styleUrls: ['./tip-calculator.component.css'],
  imports: [FormsModule, ButtonModule, ToastModule],
  providers: [MessageService],
  standalone: true,
})
export class TipCalculatorComponent implements OnInit, OnDestroy {
  currentUser$!: Observable<User | null>;
  userId: string | null = null;
  serviceName: string = '';
  bill: number = 0;
  tipPercent: number = 0;
  totalCost: number = 0;
  tips: any[] = [];

  private userSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private auth: AuthService,
    private tipService: TipCalulatorService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.currentUser$ = this.auth.currentUser; 
    // Subscribe to currentUser$ to get the user ID
    this.userSubscription = this.currentUser$.subscribe((user) => {
      this.userId = user?.id || null; // Retrieve user ID or set to null if user is null
      if (this.userId != null) {
        this.loadSavedTips();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadSavedTips() {
    try {
      this.tips = await this.dataService.getSavedTips(this.userId);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error loading saved tips.',
      });
      console.error('Error loading saved tips:', error);
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  saveTip() {
    const tipData = {
      bill_amount: this.bill.toFixed(2),
      tip_percentage: this.tipPercent.toFixed(2),
      tip_amount: this.tipService
        .calculateTip(this.bill, this.tipPercent)
        .toFixed(2),
      service_name:
        this.serviceName.length === 0 ? 'No Service Name' : this.serviceName,
      total_cost: this.totalCost.toFixed(2),
      user_id: this.userId, // Use this.userId here
    };
    if (this.bill === 0 || this.tipPercent === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a bill amount and tip percentage.',
      });
      return;
    }
    this.dataService
      .saveTip(tipData, this.userId)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tip saved successfully!',
        });
        this.loadSavedTips();
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error saving your tip.',
        });
      });
      this.resetFields();
  }
  deleteTip(tipId: string) {
    this.dataService
    .deleteTip(tipId)
    .then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tip deleted successfully!',
      });
      this.loadSavedTips();
    })
    .catch((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error deleting your tip.',
      });
    });
  }

  resetFields() {
    this.bill = 0;
    this.tipPercent = 0;
    this.totalCost = 0;
    this.serviceName = '';
  
  }
  updateTotalCost() {
    this.totalCost = this.tipService.add(
      this.bill,
      this.tipService.calculateTip(this.bill, this.tipPercent)
    );
  }
}
