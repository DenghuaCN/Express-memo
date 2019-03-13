class Toast {
    constructor(string, time) {
        this.time = time || 1000;
        this.string = string;

        this.createToast();
        this.showToast();
    }

    createToast() {
        let element = $(`<div class='toast'>${this.string}</div>`);
        this.$toast = $(element);
        $('body').append(this.$toast);
        // $('#content').append(this.$toast);
        this.$toast.hide();
    }
    showToast() {
        let that = this;
        this.$toast.fadeIn("slow", function () {
            setTimeout(function () {
                that.$toast.fadeOut("slow", function () { that.$toast.remove() });
            }, that.time)
        })
    }
}

function toast(string, time) {
    return new Toast(string, time);
}

window.Toast = toast;
module.exports.Toast = toast;