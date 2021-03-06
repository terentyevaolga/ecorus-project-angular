import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { DialogService } from '@services/dialog.service';
import { SignUpModalComponent } from '@components/modals/sign-up-modal/sign-up-modal.component';
import { PasswordValidators, PhoneValidator } from '@utils/validations.utils';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent {
	form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private toast: ToastService,
		private authService: AuthService,
		private dialog: DialogService
	) {
		this.form = this.fb.group({
			login: ['', [...PhoneValidator]],
			password: ['', [...PasswordValidators]]
		});

		this.form.markAllAsTouched();
	}

	control(name: string) {
		return this.form.get(name);
	}

	login(): void {
		if (!this.form.valid) {
			this.toast.error('Заполните все поля!');
			return;
		}

		this.authService.authorize(this.form.value).subscribe(res => {
			this.toast.success('Добро пожаловать!');
			window.location.reload();
			this.authService.token = res.token;
		})
	}

	openSignUpModal() {
		this.dialog.openDialog(SignUpModalComponent, {
			data: {
				title: 'Регистрация'
			}
		})
	}

	hasError(formControlName: string, errorName: string) {
		return this.control(formControlName)?.touched && this.control(formControlName)?.dirty && this.control(formControlName)?.hasError(errorName)
	}

}
