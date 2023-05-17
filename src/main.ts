import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Paginator from 'primevue/paginator';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import InlineMessage from 'primevue/inlinemessage';
import Chip from 'primevue/chip';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(PrimeVue);
app.use(ToastService);
app.component('PButton', Button);
app.component('PInputText', InputText);
app.component('PInputNumber', InputNumber);
app.component('PPassword', Password);
app.component('PDropdown', Dropdown);
app.component('PCheckbox', Checkbox);
app.component('PRadioButton', RadioButton);
app.component('PPaginator', Paginator);
app.component('PCard', Card);
app.component('PPanel', Panel);
app.component('PInlineMessage', InlineMessage);
app.component('PImage', Image);
app.component('PChip', Chip);
app.component('PTag', Tag);
app.component('PProgressSpinner', ProgressSpinner);

app.mount('#app');
