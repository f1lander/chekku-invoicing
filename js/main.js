angular.module('invoicing', [])

// The default logo for the invoice
.constant('DEFAULT_LOGO', 'images/coder.png')

// The invoice displayed when the user first uses the app
.constant('DEFAULT_INVOICE', {
    tax: 15.00,
    invoice_number: "",
    // customer_info: {
    //     name: 'Cementos del Norte',
    //     rtn: '05029002059059'
    // },    
    company_info: {
        name: 'CodeRoasters S.A',
        rtn: '05019018984750',
        address0: 'Col. Villas Del Sol',
        address1: '31 calle, 14 - 15 avenida',
        address2: 'San Pedro Sula, Cortés, Honduras',
        phone: '+504 33986456',
        cai: 'CE8251-F1F444-C942B3-E68B4B-07EFBB-06',
        limitDate: '13/06/2018',
        rangeTitle: 'Rango de Facturación:',
        rangeInvoice1: '000-001-01-00000011',
        rangeInvoice2: '000-001-01-00000030'
    },
    // items: [
    //     { qty: 1, description: 'Licencia Inicial de Software', cost: 990 },
    //     { qty: 5, description: 'Aplicación para dispositivos android (apk)', cost: 15 }
    // ]
})

// Service for accessing local storage
.service('LocalStorage', [function() {

    var Service = {};

    // Returns true if there is a logo stored
    var hasLogo = function() {
        return !!localStorage['logo'];
    };

    // Returns a stored logo (false if none is stored)
    Service.getLogo = function() {
        if (hasLogo()) {
            return localStorage['logo'];
        } else {
            return false;
        }
    };

    Service.setLogo = function(logo) {
        localStorage['logo'] = logo;
    };

    // Checks to see if an invoice is stored
    var hasInvoice = function() {
        return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
    };

    // Returns a stored invoice (false if none is stored)
    Service.getInvoice = function() {
        if (hasInvoice()) {
            return JSON.parse(localStorage['invoice']);
        } else {
            return false;
        }
    };

    Service.setInvoice = function(invoice) {
        localStorage['invoice'] = JSON.stringify(invoice);
    };

    // Clears a stored logo
    Service.clearLogo = function() {
        localStorage['logo'] = '';
    };

    // Clears a stored invoice
    Service.clearinvoice = function() {
        localStorage['invoice'] = '';
    };

    // Clears all local storage
    Service.clear = function() {
        localStorage['invoice'] = '';
        Service.clearLogo();
    };

    return Service;

}])

.service('Currency', [function() {

    var service = {};

    service.all = function() {
        return [{
                name: 'British Pound (£)',
                symbol: '£'
            },
            {
                name: 'Canadian Dollar ($)',
                symbol: 'CAD $ '
            },
            {
                name: 'Euro (€)',
                symbol: '€'
            },
            {
                name: 'Indian Rupee (₹)',
                symbol: '₹'
            },
            {
                name: 'Norwegian krone (kr)',
                symbol: 'kr '
            },
            {
                name: 'US Dollar ($)',
                symbol: '$'
            },
            {
                name: 'HNL Lempira (Lps)',
                symbol: 'LPS '
            }
        ]
    }

    return service;

}])




// Main application controller
.controller('InvoiceCtrl', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
    function($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

        // Set defaults
      
        $scope.currencySymbol = 'LPS ';
        $scope.logoRemoved = false;
        $scope.printMode = false;
        
      
        (function init() {
            $scope.invoice = {};
            $scope.invoice.items = [];
            $scope.currentDate = new Date;
          
            
            // Attempt to load invoice from local storage
            ! function() {
                var invoice = LocalStorage.getInvoice();
                $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
                $scope.invoice.customer_info = {};
            }();

            // Set logo to the one from local storage or use default
            ! function() {
                var logo = LocalStorage.getLogo();
                $scope.logo = logo ? logo : DEFAULT_LOGO;
            }();

            $scope.availableCurrencies = Currency.all();

            $scope.products  = [
                { qty: 1, description: 'Licencia Inicial de Software', cost: 990 },
                { qty: 1, description: 'Licencia de Software (Reportes) 50%', cost: 990 },
                { qty: 1, description: 'Aplicación para dispositivos android (apk)', cost: 15 },
                { qty: 1, description: 'Pago Mensual de Servicio Chekku - 10 USD', cost: 10 },
                { qty: 1, description: 'Pago Mensual de Servicio Chekku', cost: 10 },
                { qty: 1, description: 'Desarrollo personalizado 50%', cost: 10 },
                { qty: 1, description: 'Celular Motorola 32gb mem. 2gb ram, Quad Core, 3000+ mAh', cost: 10 },
                { qty: 1, description: 'Pago Mensual de Servicio Chekku - 13 USD', cost: 13 },
                { qty: 1, description: 'Pago Mensual de Servicio Chekku - 15 USD', cost: 15 },
                { qty: 1, description: 'Costo operativos de servicio de aplicacion Chekku', cost: 15 },
            ];
            $scope.customers = [
                { name: "Represantaciones Metalias", rtn:"05019016852138"},
                { name: "Empresa Dieck y Dieck", rtn:"05119995190534"},
                { name: "Sogesa", rtn:"08019002276608"},
                { name: "Procasa", rtn:"05019007066556"},
                { name: "Cementos del Norte S.A", rtn:"05029002059059"},
                { name: "Grupo Diserb", rtn: "05019011359451"}
            ];

        })()
        // Adds an item to the invoice's items
        $scope.addItem = function() {
            if($scope.invoice.items){

                $scope.invoice.items.push({ qty: 0, cost: 0, description: "" });
            } else {
                $scope.invoice.items = [];
                $scope.invoice.items.push({ qty: 0, cost: 0, description: "" });
            }
            
        }

        // Toggle's the logo
        $scope.toggleLogo = function(element) {
            $scope.logoRemoved = !$scope.logoRemoved;
            LocalStorage.clearLogo();
        };

        // Triggers the logo chooser click event
        $scope.editLogo = function() {
            // angular.element('#imgInp').trigger('click');
            document.getElementById('imgInp').click();
        };

        $scope.printInfo = function() {
            window.print();
        };

        // Remotes an item from the invoice
        $scope.removeItem = function(item) {
            $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
        };

        // Calculates the sub total of the invoice
        $scope.invoiceSubTotal = function() {
            var total = 0.00;
            angular.forEach($scope.invoice.items, function(item, key) {
                total += (item.qty * item.cost);
            });
            return total;
        };

        // Calculates the tax of the invoice
        $scope.calculateTax = function() {
            return (($scope.invoice.tax * $scope.invoiceSubTotal()) / 100);
        };

        // Calculates the grand total of the invoice
        $scope.calculateGrandTotal = function() {
            saveInvoice();
            return ($scope.calculateTax() + $scope.invoiceSubTotal());
        };

        // Clears the local storage
        $scope.clearLocalStorage = function() {
            var confirmClear = confirm('Are you sure you would like to clear the invoice?');
            if (confirmClear) {
                LocalStorage.clear();
                setInvoice(DEFAULT_INVOICE);
            }
        };

        // Sets the current invoice to the given one
        var setInvoice = function(invoice) {
            $scope.invoice = invoice;
            saveInvoice();
        };

        // Reads a url
        var readUrl = function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('company_logo').setAttribute('src', e.target.result);
                    LocalStorage.setLogo(e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
            }
        };

        // Saves the invoice in local storage
        var saveInvoice = function() {
            LocalStorage.setInvoice($scope.invoice);
        };

        // Runs on document.ready
        angular.element(document).ready(function() {
            // Set focus
            document.getElementById('invoice-number').focus();

            // Changes the logo whenever the input changes
            document.getElementById('imgInp').onchange = function() {
                readUrl(this);
            };
        });

    }
])