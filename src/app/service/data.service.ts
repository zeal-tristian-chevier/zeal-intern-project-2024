import { Injectable, OnInit } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;
  currentUser$!: Observable<User | null>;
  constructor(private auth: AuthService) {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }
  async getSavedTips(userId: string | null) {
    const tips = await this.supabase
      .from('tips')
      .select('*')
      .eq('user_id', userId);
    return tips.data || [];
  }
  async saveTip(tip: any, userId: string | null) {
    const { error } = await this.supabase
      .from('tips')
      .insert([
        {
          bill_amount: tip.bill_amount,
          tip_percentage: tip.tip_percentage,
          tip_amount: tip.tip_amount,
          service_name: tip.service_name,
          total_cost: tip.total_cost,
          user_id: userId,
        },
      ]);
    console.log(error);
  }
  async deleteTip(tipId: string) {
    const { error } = await this.supabase
    .from('tips')
    .delete().eq('id', tipId);
  console.log(error);
  }
}
