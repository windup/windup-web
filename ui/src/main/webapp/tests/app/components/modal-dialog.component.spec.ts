import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {DebugElement, Component, ViewChild} from "@angular/core";
import {ModalDialogComponent} from "../../../app/components/modal-dialog.component";

let host: ModalDialogHost;
let hostFixture: ComponentFixture<ModalDialogHost>;

let comp: ModalDialogComponent;
let fixture: ComponentFixture<ModalDialogComponent>;
let de: DebugElement;
let el: HTMLElement;

@Component({
    template: `
    <modal-dialog>
        <div body class="body"><strong>Body for test</strong></div>
        <div header class="header"><strong>Header for test</strong></div>
        <div footer class="footer"><strong>Footer for test</strong></div>
    </modal-dialog>`
})
class ModalDialogHost {
    @ViewChild(ModalDialogComponent)
    modalDialog: ModalDialogComponent;
}

describe('BannerComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalDialogHost, ModalDialogComponent], // declare the test components
        })
            .compileComponents();

        hostFixture = TestBed.createComponent(ModalDialogHost);
        host = hostFixture.componentInstance;

        comp = host.modalDialog;

        de = hostFixture.debugElement.query(By.css('modal'));
        el = de.nativeElement;
    }));

    let testContent = (cssClass: string, text: string) => {
        let header = hostFixture.debugElement.query(By.css(cssClass));
        expect(header).not.toBeNull();
        expect(header.children.length).toBe(1);
        expect(header.children[0].name).toBe('strong');
        expect(header.children[0].nativeElement.textContent).toBe(text);
    };

    let isElementVisible = (element: HTMLElement) => {
        return element.offsetHeight !== 0;
    };

    it('Should show header', () => {
        testContent('.header', 'Header for test');
    });

    it('Should show body', () => {
        testContent('.body', 'Body for test');
    });

    it('Should show footer', () => {
        testContent('.footer', 'Footer for test');
    });

    it('By default dialog should be hidden', () => {
        expect(isElementVisible(el)).toBe(false);
    });

    it('Should be visible when show is called', () => {
        comp.show();
        expect(isElementVisible(el)).toBe(true);
    });

    it('Should be hidden when hide is called', () => {
        comp.show();
        comp.hide();
        expect(isElementVisible(el)).toBe(false);
    });
});
