import lozad from 'lozad'
import '../styles/main.css';
import Swiper, { Autoplay } from 'swiper';

const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

export default new class Home {
	constructor() {
		this.swiper = 'swiper__company'
		this.handler();
	}

	handler() {
		Swiper.use([Autoplay])
		const swiper = new Swiper(`.${this.swiper}`, {
			slidesPerView: 1,
			centeredSlides: true,
			loop: true,
			spaceBetween: 40,
			autoplay: {
				delay: 1500,
			},
			breakpoints: {
				640: {
					slidesPerView: 2,
				},
				768: {
					slidesPerView: 3,
				}
			}
		})
	}
}