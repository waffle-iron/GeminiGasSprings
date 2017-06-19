var wizardCurrentStepIndex = -1;
var imgLeft = 200;
var imgTop = 150;
var imgWidth = 500;
var imgHeight = 50;
var sptialLength = 23;
var tubeSptialLength = 24;
var productSelected = false;
var wizardConfiguration = {};
var wizardDescriptors = [];
var isWizardEnded = false;
var springImgUrl = null;

//Configuration Keys
var productIdKey = "productId";
var forceKey = "force";
var strokeKey = "stroke";
var springKey = "spring";
var endFittingKey = "endFitting";
var endFittingMaterialKey = "endFittingMaterial";
var endFittingConfigurationKey = "endFittingConfiguration";
var pistonRodEndFittingsTableKey = "pistonRodEndFittingsTable";
var pistonRodBracketKey = "pistonRodBracket";
var lockingTubeKey = "lockingTube";
var bellowKey = "bellow";
var tubeEndFittingKey = "tubeEndFitting";
var tubeEndFittingMaterialKey = "tubeEndFittingMaterial";
var tubeEndFittingsTableKey = "tubeEndFittingsTable";
var tubeEndFittingConfigurationKey = "tubeEndFittingConfiguration";
var tubeBracketKey = "tubeBracket";
var extensionKey = "extension";
var extensionLengthKey = "extensionLength";
var bellowOverviewImage = "bellow_overview.png";
var lockingTubeOverviewImage = "safety_overview.png";
var normalFooter;
var weldedEyesFooter;

//Wizard Parameters with default test values
var dictionaryNodeId = 3821;
var currentLanguage = "DK";
var imagesBaseUrl = "http://test.fjedre.dk/ConfiguratorImages/";
var pdfUrl = 'http://www.industrial-springs.com/pdf/';
var serviceUrl = "http://test.fjedre.dk/RestfulConfiguratorService.Service.svc";
var priceListUrl = '';
var footerContactInfo = 'test footer text';
var springPdfEmailTemplate = 3813;
var springOfferEmailTemplate = 7981;



$(document).ready(function () {
    if (typeof initWizardParams == 'function') { initWizardParams(); }
    showLoading();
    getLocalizedStrings(dictionaryNodeId);
    $('#btnPreviousStep').hover(function () { $('#previousStepTip').show(); }, function () { $('#previousStepTip').hide(); });
    $('.basketCell').hide();
    if (footerContactInfo != null)
        $('#copyright').html(footerContactInfo);
});

function getMarkers() {
    return "###Name###:" + $('#txtRecipientName').val() + "^" + "###Message###:" + $('#txtRecipientMsg').val();
}

function getAttachments() {

    var pistonRodItemNo = wizardConfiguration[endFittingConfigurationKey] == null || wizardConfiguration[endFittingConfigurationKey] == undefined ? '' : wizardConfiguration[endFittingConfigurationKey].ItemNo + '.pdf';
    var tubeItemNo = wizardConfiguration[tubeEndFittingConfigurationKey] == null || wizardConfiguration[tubeEndFittingConfigurationKey] == undefined ? '' : wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo + '.pdf';
    var tubeBracketItemNo = wizardConfiguration[tubeBracketKey] == null || wizardConfiguration[tubeBracketKey] == undefined ? '' : wizardConfiguration[tubeBracketKey] + '.pdf';
    var pistonRodBracketItemNo = wizardConfiguration[pistonRodBracketKey] == null || wizardConfiguration[pistonRodBracketKey] == undefined ? '' : wizardConfiguration[pistonRodBracketKey] + '.pdf';
    var extensionItemNo = wizardConfiguration[extensionKey] == null || wizardConfiguration[extensionKey] == undefined ? '' : wizardConfiguration[extensionKey] + '.pdf';
    return [pistonRodItemNo, tubeItemNo, tubeBracketItemNo, pistonRodBracketItemNo, extensionItemNo];

}

function addToBasket() {
    PutInBag(wizardConfiguration[springKey].ProductNo, currentLanguage, 1);
    if (wizardConfiguration[endFittingConfigurationKey] != null && wizardConfiguration[endFittingConfigurationKey] != undefined)
        PutInBag(wizardConfiguration[endFittingConfigurationKey].ItemNo, currentLanguage, 1);

    if (wizardConfiguration[lockingTubeKey] != null && wizardConfiguration[lockingTubeKey] != undefined) {
        PutInBag(wizardConfiguration[lockingTubeKey], currentLanguage, 1);
    }

    if (wizardConfiguration[bellowKey] != null && wizardConfiguration[bellowKey] != undefined) {
        PutInBag(wizardConfiguration[bellowKey], currentLanguage, 1);
    }

    if (wizardConfiguration[tubeEndFittingConfigurationKey] != null && wizardConfiguration[tubeEndFittingConfigurationKey] != undefined)
        PutInBag(wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo, currentLanguage, 1);

    if (wizardConfiguration[pistonRodBracketKey] != null && wizardConfiguration[pistonRodBracketKey] != undefined) {
        PutInBag(wizardConfiguration[pistonRodBracketKey], currentLanguage, 1);
    }

    if (wizardConfiguration[tubeBracketKey] != null && wizardConfiguration[tubeBracketKey] != undefined) {
        PutInBag(wizardConfiguration[tubeBracketKey], currentLanguage, 1);
    }

    if (wizardConfiguration[extensionKey] != null && wizardConfiguration[extensionKey] != undefined) {
        PutInBag(wizardConfiguration[extensionKey], currentLanguage, 1);
    }

    GoToBag();
}

function openPriceList(itemNo) {
    openWin(priceListUrl, itemNo, false);
}

function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    if (queryString != null && queryString.length > 1) {
        var keyValues = queryString.split('&');
        if (keyValues != null && keyValues.length > 0) {
            for (var i in keyValues) {
                if (keyValues[i] != undefined && keyValues[i] != null) {
                    var key = keyValues[i].split('=');
                    if (key.length > 1) {
                        assoc[decode(key[0])] = decode(key[1]);
                    }
                }
            }
        }
    }
    return assoc;
}

function loadFooterText() {
    $('#gasSpring').html(getLocalizedString("GasSpringConfigurator"));
    $('#gasSpring_offerTable').html(getLocalizedString("GasSpringConfigurator"));
    $('#unitSpecs').html(getLocalizedString("AssemblySpecification"));
    $('#unitSpecs_offerTable').html(getLocalizedString("AssemblySpecification"));
    $('#pistonRodTitle').html(getLocalizedString("PistonRodFooterText"));
    $('#gasSpringTitle').html(getLocalizedString("GasSpringTitle"));
    $('#gasSpringTitle_offerTable').html(getLocalizedString("GasSpringTitle"));
    $('#tubeFooterTitle').html(getLocalizedString("TubeFooterText"));
    $('#endFitting1FooterTitle').html(getLocalizedString("EndFittingRodFooterText"));
    $('#endFitting1FooterTitle_offerTable').html(getLocalizedString("EndFittingRodFooterText"));
    $('#strokeFooterTitle').html(getLocalizedString("StrokeFooterText"));
    $('#endFitting2FooterTitle').html(getLocalizedString("EndFittingTubeFooterText"));
    $('#endFitting2FooterTitle_offerTable').html(getLocalizedString("EndFittingTubeFooterText"));
    $('#forceFooterTitle').html(getLocalizedString("NForceNewtonFooterText"));
    $('#braketRodFooterTitle').html(getLocalizedString("BracketRodText"));
    $('#braketRodFooterTitle_offerTable').html(getLocalizedString("BracketRodText"));
    $('#totalLengthWithoutThreadsFooterTitle').html(getLocalizedString("TotalLengthWithoutThreadFooterText"));
    $('#bracketTubeFooterTitle').html(getLocalizedString("BracketTubeText"));
    $('#bracketTubeFooterTitle_offerTable').html(getLocalizedString("BracketTubeText"));
    $('#totalLengthWithFittingsFooterTitle').html(getLocalizedString("TotalLengthWithFitting"));
    $('#extensionFooterTitle').html(getLocalizedString("Extension"));
    $('#extensionFooterTitle_offerTable').html(getLocalizedString("Extension"));
    $('#lockingTubeFooterTitle').html(getLocalizedString("LockingTube"));
    $('#lockingTubeFooterTitle_offerTable').html(getLocalizedString("LockingTube"));
    $('#bellowFooterTitle').html(getLocalizedString("Bellow"));
    $('#bellowFooterTitle_offerTable').html(getLocalizedString("Bellow"));
    $('#stockLevelTitle').html(getLocalizedString("StockLevel"));
    $('#qtyTitle').html(getLocalizedString("Quantity"));
    $("#sendOfferTilte").html(getLocalizedString("SendOffer"));
    $("#yourNameTitle").html(getLocalizedString("YourName"));
    $("#alternativeNameTitle").html(getLocalizedString("AlternativeName"));
    $("#customerType").html(getLocalizedString("CustomerType"));
    $("#businessCustomer").html(getLocalizedString("BusinessCustomer"));
    $("#privateCustomer").html(getLocalizedString("PrivateCustomer"));
    $("#selectCountry").html(getLocalizedString("ShipToCountry"));

    //Welded Eyes
    $('#totalLengthEyeToEyeTitle').html(getLocalizedString("TotalLengthEyesToEyeText"));
    $('#welededEyesHoleSizeTitle').html(getLocalizedString("HoleSize"));
    $('#welededEyesThinknessTitle').html(getLocalizedString("Thickness"));

    $('#threadSizeFooterTitle').html(getLocalizedString("ThreadSize"));
    $('#copyright').html(getLocalizedString(''));
    $('#btnDownload').val(getLocalizedString('DownloadDataButton'));
    $('#btnPrintData').val(getLocalizedString('PrintDataButton'));
    $('#btnEmailData').val(getLocalizedString('EmailDataButton'));
    $('#btnSendOffer').val(getLocalizedString('SendOffer'));
    $('#btnDoSendOffer').val(getLocalizedString('SendOfferButton'));
    $('#emailStepDescription').html(getLocalizedString('NoteText'));
    $('#btnCancelEmailSend').val(getLocalizedString('CancelText'));
    $('#btnCancelSendOffer').val(getLocalizedString('CancelText'));
    $('#btnSendEmail').val(getLocalizedString('EmailDataButton'));
    $('#lblEmail').html(getLocalizedString('Email'));
    $('#lblRecipientName').html(getLocalizedString('SenderName'));
    $('#titleRecipientMsg').html(getLocalizedString('MessageForRecipient'));
}

function computeTotalProductLength() {
    var totalLength = getTotalProductLength();
    var springLength = wizardConfiguration[springKey] == null ? 0 : wizardConfiguration[springKey].Length;
    if (totalLength <= springLength)
        animateFooterText('#totalLengthWithFitingsFooterValue', "");
    else if (totalLength > 0) {
        animateFooterText('#totalLengthWithFitingsFooterValue', totalLength.toFixed(2) + " mm");
    }
}

function getTotalProductLength() {
    var springLength = wizardConfiguration[springKey] == null ? 0 : wizardConfiguration[springKey].Length;
    var rodLength = wizardConfiguration[endFittingConfigurationKey] == null ? 0 : wizardConfiguration[endFittingConfigurationKey].RowValues[0];
    var tubeLength = wizardConfiguration[tubeEndFittingConfigurationKey] == null ? 0 : wizardConfiguration[tubeEndFittingConfigurationKey].RowValues[0];
    var extensionLength = wizardConfiguration[extensionLengthKey] == null ? 0 : wizardConfiguration[extensionLengthKey];
    var totalLength = springLength + rodLength + tubeLength + parseFloat(extensionLength);
    return totalLength;
}

function isWeldedEyesProduct() {
    return wizardConfiguration[productIdKey] == "1055";
}

function isTractionProduct() {
    return wizardConfiguration[productIdKey] == "1080";
}

function isThreadEndFitting(group) {
    if (group == null || group == undefined)
        return false;
    var endFittingGroup = group.toString();
    return (endFittingGroup == "10498" || endFittingGroup == "10508" || endFittingGroup == "10518" || endFittingGroup == "10528");
}

function getCurrentStepDescription(stepKey) {
    return getLocalizedString(stepKey);
}

function getStepTitle() {
    if (wizardCurrentStepIndex < 0) {
        return "";
    }
    var stepIndex = wizardCurrentStepIndex + 1;
    var stepTitle = getLocalizedString("Step");
    return stepTitle + " " + stepIndex.toString() + ". ";
}

function showLoading() {
    $('#overlay').show();
}

function removeLoading() {
    $('#overlay').hide();
}

function getLocalizedString(key) {
    return localizedStrings["SpringGasConfigurator_" + key];
}

function wizardResourcesLoaded() {
    $('#stepDescription').html(getLocalizedString("WizardStartStepDescription"));
    $('#gasSpringHeader').html(getLocalizedString("GasSpringConfigurator"));
    $('.bubble').html(getLocalizedString('PreviousButton'));

    getProducts(currentLanguage, productsCompleted);
}

function createProducts(products) {
    var html = '<ol id="products">';
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var imageUrl = imagesBaseUrl + product.ImageUrl;
        var productHtml = '<li imageUrl="' + product.ImageUrl + '" productId="' + product.ProductName + '"><img src="' + imageUrl + '"/><span>' + product.Description + '</span></li>';
        html += productHtml;
    }
    html += '</ol>';
    return html;
}

function getHtmlEncodedContent() {
    var htmlContent = $('#wizardContainer');
    htmlContent.find('.footerInfoImg').hide();
    htmlContent.find('input').hide();
    htmlContent.find('#logoContainer').removeClass();
    htmlContent.find('#copyright').removeClass();
    htmlContent.find('.basketCell').hide();
    htmlContent.find('#configurator').css('border', 'transparent solid 1px');
    htmlContent.css('margin', '');
    $('#wizard').css('margin', '');
    html2canvas(document.getElementById('wizardContainer'), {
        onrendered: function (canvas) {
            htmlContent.css('margin', 'auto');
            $('#wizard').css('margin', 'auto');
            htmlContent.find('.footerInfoImg').show();
            htmlContent.find('input').show();
            htmlContent.find('#logoContainer').addClass('noScreen');
            htmlContent.find('#copyright').addClass('noScreen');
            htmlContent.find('#configurator').css('border', 'black solid 1px');
            htmlContent.find('.basketCell').show();
            htmlContent = canvas.toDataURL().replace('data:image/png;base64,', '');
            downloadPdf(htmlContent);
        },
        useCORS: true,
        proxy: 'http://fjedre.dk/'
    });
}

function sendEmail() {
    var htmlContent = $('#wizardContainer');
    htmlContent.find('.footerInfoImg').hide();
    htmlContent.css('margin', '');
    htmlContent.find('input').hide();
    htmlContent.find('#logoContainer').removeClass();
    htmlContent.find('#copyright').removeClass();
    htmlContent.find('.basketCell').hide();
    htmlContent.find('#configurator').css('border', 'transparent solid 1px');
    html2canvas(document.getElementById('wizardContainer'), {
        onrendered: function (canvas) {
            htmlContent.css('margin', 'auto');
            htmlContent.find('.footerInfoImg').show();
            htmlContent.find('input').show();
            htmlContent.find('#logoContainer').addClass('noScreen');
            htmlContent.find('#copyright').addClass('noScreen');
            htmlContent.find('.basketCell').show();
            htmlContent.find('#configurator').css('border', 'black solid 1px');
            htmlContent = canvas.toDataURL().replace('data:image/png;base64,', '');
            emailData($('#txtEmail').val(), htmlContent);
        },
        useCORS: true,
        proxy: 'http://fjedre.dk/'
    });
}

function appendFooterApi() {
    $('#btnDownload').click(function () {
        getHtmlEncodedContent();
    });
    $('#btnEmailData').click(function () {
        $('#sendEmailForm').show();
        hideDefaultFooter();
    });
    $('#btnCancelEmailSend').click(function () {
        $('#sendEmailForm').hide();
        showDefaultFooter();
    });
    $('#btnSendEmail').click(function () {
        $('#sendEmailForm').hide();
        showDefaultFooter();
        sendEmail();
    });
    $('.basketCell').click(function () {
        addToBasket();
    });
    $("#btnSendOffer").click(function () {
        $("#sendOfferForm").show();
        hideDefaultFooter();
        updateOfferTableValues();
        updateInputPlaceHolders();
    });
    $("#btnCancelSendOffer").click(function () {
        $("#sendOfferForm").hide();
        showDefaultFooter();
    });

    $("#btnDoSendOffer").click(function () {
        sendOffer();
    });

}

function sendOffer() {
    //var form = $("#offerInputForm");
    //if (form.checkValidity || form.checkValidity()) {
    //}
    var isB2B = $("#optionCustomerType").val() == "1";
    sendOfferEmail($("#txtEmailAddress").val(), $("#txtYourName").val(), $("#txtAlternativeName").val(),
        $("#txtAlternativeEmailAddress").val(), $("#optionCountries").val(), isB2B, getOfferItems());

    $("#sendOfferForm").hide();
    showDefaultFooter();
}

function getOfferItems() {
    var items = new Array();
    var springImageUrl = imagesBaseUrl + "email_" + wizardConfiguration[productIdKey] + ".png";
    var springItem = { "ItemNo": wizardConfiguration[springKey].ProductNo, "Qty": $("#txtGasSpringQty").val(), "ImageUrl": springImageUrl };
    items.push(springItem);

    if (parseInt($("#txtEndFitting1Qty").val()) > 0) {
        var endFitting1 = { "ItemNo": wizardConfiguration[endFittingConfigurationKey].ItemNo, "Qty": $("#txtEndFitting1Qty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[endFittingConfigurationKey].RodImageUrl };
        items.push(endFitting1);
    }
    if (parseInt($("#txtEndFitting2Qty").val()) > 0) {
        var endFitting2 = { "ItemNo": wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo, "Qty": $("#txtEndFitting2Qty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[tubeEndFittingConfigurationKey].TubeImageUrl };
        items.push(endFitting2);
    }
    if (parseInt($("#txtBracketRodQty").val()) > 0) {
        var bracketRod = { "ItemNo": wizardConfiguration[pistonRodBracketKey], "Qty": $("#txtBracketRodQty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[pistonRodBracketKey] + ".png" };
        items.push(bracketRod);
    }
    if (parseInt($("#txtBracketTubeQty").val()) > 0) {
        var tubeBracket = { "ItemNo": wizardConfiguration[tubeBracketKey], "Qty": $("#txtBracketTubeQty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[tubeBracketKey] + ".png" };
        items.push(tubeBracket);
    }
    if (parseInt($("#txtExtensionQty").val()) > 0) {
        var extension = { "ItemNo": wizardConfiguration[extensionKey], "Qty": $("#txtExtensionQty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[extensionKey] + ".png" };
        items.push(extension);
    }
    if (parseInt($("#txtLockingTubeQty").val()) > 0) {
        var lockingTube = { "ItemNo": wizardConfiguration[lockingTubeKey], "Qty": $("#txtLockingTubeQty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[lockingTubeKey] + ".png" };
        items.push(lockingTube);
    }
    if (parseInt($("#txtBellowQty").val()) > 0) {
        var bellow = { "ItemNo": wizardConfiguration[bellowKey], "Qty": $("#txtBellowQty").val(), "ImageUrl": imagesBaseUrl + wizardConfiguration[bellowKey] + ".png" };
        items.push(bellow);
    }
    return items;
}

function updateInputPlaceHolders() {
    var emailText = getLocalizedString("Email");
    var nameText = getLocalizedString("Name");
    document.getElementById("txtAlternativeEmailAddress").placeholder = emailText;
    document.getElementById("txtEmailAddress").placeholder = emailText;
    document.getElementById("txtYourName").placeholder = nameText;
    document.getElementById("txtAlternativeName").placeholder = nameText;
}

function updateOfferTableValues() {
    getCountries();
    $("#gasSpringValue_offerTable").html(wizardConfiguration[springKey].ProductNo);
    addPriceButton(wizardConfiguration[springKey].ProductNo, "#gasSpringPriceButton");

    var isRodHasThreadEnd = isThreadEndFitting(wizardConfiguration[endFittingKey]);
    if (!isRodHasThreadEnd) {
        $("#endFitting1FooterValue_offerTable").html(wizardConfiguration[endFittingConfigurationKey].ItemNo);
        addPriceButton(wizardConfiguration[endFittingConfigurationKey].ItemNo, "#endFitting1PriceButton");
        adjustQtyInputsVisiblity(wizardConfiguration[endFittingConfigurationKey].ItemNo, "#txtEndFitting1Qty");
    } else {
        adjustQtyInputsVisiblity("", "#txtEndFitting1Qty");
    }

    var isTubeHasThreadEnd = isThreadEndFitting(wizardConfiguration[tubeEndFittingKey]);
    if (!isTubeHasThreadEnd) {
        $("#endFitting2FooterValue_offerTable").html(wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo);
        addPriceButton(wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo, "#gasEndFitting2PriceButton");
        adjustQtyInputsVisiblity(wizardConfiguration[tubeEndFittingConfigurationKey].ItemNo, "#txtEndFitting2Qty");
    } else {
        adjustQtyInputsVisiblity("", "#txtEndFitting2Qty");
    }

    $("#braketRodFooterValue_offerTable").html(wizardConfiguration[pistonRodBracketKey]);
    addPriceButton(wizardConfiguration[pistonRodBracketKey], "#bracketRodPriceButton");
    adjustQtyInputsVisiblity(wizardConfiguration[pistonRodBracketKey], "#txtBracketRodQty");

    $("#bracketTubeFooterValue_offerTable").html(wizardConfiguration[tubeBracketKey]);
    addPriceButton(wizardConfiguration[tubeBracketKey], "#bracketTubePriceButton");
    adjustQtyInputsVisiblity(wizardConfiguration[tubeBracketKey], "#txtBracketTubeQty");

    $("#extensionFooterValue_offerTable").html(wizardConfiguration[extensionKey]);
    addPriceButton(wizardConfiguration[extensionKey], "#extensionPriceButton");
    adjustQtyInputsVisiblity(wizardConfiguration[extensionKey], "#txtExtensionQty");

    $("#lockingTubeFooterValue_offerTable").html(wizardConfiguration[lockingTubeKey]);
    addPriceButton(wizardConfiguration[lockingTubeKey], "#lockingTubePriceButton");
    adjustQtyInputsVisiblity(wizardConfiguration[lockingTubeKey], "#txtLockingTubeQty");

    $("#bellowFooterValue_offerTable").html(wizardConfiguration[bellowKey]);
    addPriceButton(wizardConfiguration[bellowKey], "#bellowPriceButton");
    adjustQtyInputsVisiblity(wizardConfiguration[bellowKey], "#txtBellowQty");
}

function adjustQtyInputsVisiblity(footerValue, input) {
    if (footerValue == "" || footerValue == null)
        $(input).hide();
    else
        $(input).show();
}

function addPriceButton(footerValue, container) {
    if (footerValue == "" || footerValue == null) return;
    var priceText = getLocalizedString("PricesButton");
    var html = '<input type="button" onclick="openPriceList(\'' + footerValue + '\')" value="' + priceText + '" />';
    $(container).html(html);
}

function hideDefaultFooter() {
    if (isWeldedEyesProduct())
        $('#wizardFooterWeldedEyesTable').hide();
    else
        $('#wizardFooterTable').hide();
}

function showDefaultFooter() {
    if (isWeldedEyesProduct())
        $('#wizardFooterWeldedEyesTable').show();
    else
        $('#wizardFooterTable').show();
}

function getCountriesCompleted(countries) {
    var mySelect = $('#optionCountries');
    $.each(countries, function (index, item) {
        mySelect.append(
            $('<option></option>').val(item.Code).html(item.Name)
        );
    });
}

function productsCompleted(products) {
    var html = createProducts(products);
    $('#configurator').append(html);
    removeLoading();
    $("#products").selectable({
        selected: function (event, ui) {
            var selectedProduct = $(".ui-selected").attr('productId');
            var productImg = $(".ui-selected").attr('imageUrl');
            productSelectionCompleted(selectedProduct, productImg);
        }
    });
    var queryStringProductId = getQueryStrings()["ProductID"];
    var product = null;
    if (queryStringProductId != null && queryStringProductId != '') {
        for (var i = 0; i < products.length; i++) {
            var currentProduct = products[i];
            if (currentProduct.ProductName == queryStringProductId) {
                product = currentProduct;
                break;
            }
        }
        productSelectionCompleted(queryStringProductId, product.ImageUrl);
    }
}

function productSelectionCompleted(selectedProduct, productImg) {
    if (!productSelected) {
        if (normalFooter == null)
            normalFooter = $('#wizardFooterTable').detach();
        if (weldedEyesFooter == null)
            weldedEyesFooter = $('#wizardFooterWeldedEyesTable').detach();
        productSelected = true;
        wizardConfiguration[productIdKey] = selectedProduct;
        if (isTractionProduct())
            imgWidth = 360;
        if (isWeldedEyesProduct()) {
            { weldedEyesFooter.appendTo('#wizardFooter'); weldedEyesFooter = null; }
        }
        else {
            normalFooter.appendTo('#wizardFooter');
            normalFooter = null;
        }
        appendFooterApi();
        drawStep1(selectedProduct, productImg);
    }
}

function drawStep1(productName, imageUrl) {
    $('#products').slideUp('fast', function () { $('#products').remove(); });
    imageUrl = imagesBaseUrl + imageUrl;
    springImgUrl = imageUrl;
    var image = '<img id="imgProduct" src="' + imageUrl + '" />';
    $('#wizardBody').show();
    $("#wizardFooter").show();
    $(image).fadeIn('fast', function () { $('#springImage').append(image); });
    $('#springImage').show();
    getForces(productName);
    loadFooterText();
    $('#addToBasket').html(getLocalizedString('PutInBasketButton'));
    nextStep();
}

function forcesCompleted(forces) {
    var queryStringForce = getQueryStrings()["Newton"];
    var stepCanvas = createStep1Canvas();
    $('#wizardBody').append($(stepCanvas));

    var html = '<select id="cmbForces" class="selector">';
    //Append the select option text
    var selectText = getLocalizedString("NForceDropdownSelectText");
    var option = '<option value ="">' + selectText + '</option>';
    html += option;
    for (var i = 0; i < forces.length; i++) {
        var force = forces[i];
        var newOption = '<option value ="' + force.Value + '">';
        newOption += force.Name + '</option>';
        html += newOption;
    }
    html += '</select>';
    $('#wizardBody').append($(html));
    $('#cmbForces').change(function () {
        var selectedForce = $("#cmbForces").val();
        forceSelected(selectedForce);
    });

    // 25 is the length of the horizontal line
    var cmbLeft = imgLeft + 315 + 25;

    //10 is the arrow length to center dropdown with the arrow.
    var cmbTop = imgTop + imgHeight + 110 - 10;
    $('#cmbForces').css('left', cmbLeft.toString() + 'px');
    $('#cmbForces').css('top', cmbTop.toString() + 'px');


    $('#wizardBody').append($('<strong id="dropDownForceTitle">N</strong>'));
    $('#dropDownForceTitle').css('position', 'absolute');
    $('#dropDownForceTitle').css('left', cmbLeft.toString() + 'px');
    $('#dropDownForceTitle').css('top', (cmbTop - 20).toString() + 'px');

    animateSelectionText('selectForce', "SelectForceText", cmbLeft + 120, cmbTop + 4);

    var selectionTextDescriptor = createSelectionTextDescriptor('selectForce', "SelectForceText", cmbLeft + 120, cmbTop);
    createStepDescriptor(["forceFooterValue"], ["selectForce"], ["cmbForces"], ["selectForce", "cmbForces", "dropDownForceTitle", "step1Canvas"], selectionTextDescriptor, 0, "Step1Description");
    if (queryStringForce != null && queryStringForce != '') {
        $("#cmbForces").val(parseInt(queryStringForce));
        $("#cmbForces").change();
    }
}

function createStep1Canvas() {
    var stepCanvas = createCanvas('step1Canvas');
    var verticalLineLeft = imgLeft + 315;
    var verticalLineTop = imgTop + imgHeight;
    drawLine(verticalLineLeft, verticalLineTop, verticalLineLeft, verticalLineTop + 120, stepCanvas.getContext('2d'), false, false);
    var horizontalLineLeft = imgLeft + 315;
    var horizontalLineTop = imgTop + imgHeight + 110;
    drawLine(horizontalLineLeft, horizontalLineTop, verticalLineLeft + 25, horizontalLineTop, stepCanvas.getContext('2d'), false, true);
    return stepCanvas;
}

function forceSelected(selectedForce) {
    $('#forceFooterValue').fadeOut("slow", function () {
        $(this).html(selectedForce + " N");
        $('#forceFooterValue').fadeIn("slow");
    });
    wizardConfiguration[forceKey] = selectedForce;
    getStrokes(wizardConfiguration[productIdKey], selectedForce);
}

function strokesCompleted(strokes) {
    nextStep();
    drawStep2(strokes);
}

function drawStep2(strokes) {
    var queryStringStroke = getQueryStrings()["L1"];
    //Draw the lines
    var stepCanvas = createCanvas('step2Canvas');
    $('#wizardBody').append($(stepCanvas));
    var horizontalLineLeft = imgLeft + 315;
    var horizontalLineTop = imgTop + imgHeight + 50;


    var verticalLineTop = imgTop + imgHeight;
    var verticalLineLeft = horizontalLineLeft + (isWeldedEyesProduct() ? 127 : 160);
    drawLine(verticalLineLeft, verticalLineTop, verticalLineLeft, verticalLineTop + 60, stepCanvas.getContext('2d'), false, false);


    var html = '<select id="cmbStrokes" class="selector">';
    //Append the select option text
    var selectText = getLocalizedString("StrokeDropdownSelectText");
    var option = '<option value ="">' + selectText + '</option>';
    html += option;
    for (var i = 0; i < strokes.length; i++) {
        var force = strokes[i];
        var newOption = '<option value ="' + force.Value + '">';
        newOption += force.Name + '</option>';
        html += newOption;
    }
    html += '</select>';
    var cmbStrokesTop = imgTop + imgHeight + 50 - 10;
    var cmbStrokesLeft = imgLeft + 315 + 25;
    $('#wizardBody').append($(html));
    $('#cmbStrokes').css('position', 'absolute');
    $('#cmbStrokes').css('left', cmbStrokesLeft + 'px');
    $('#cmbStrokes').css('top', cmbStrokesTop + 'px');
    $('#cmbStrokes').css('width', '80px');
    $('#cmbStrokes').change(function () {
        var selectedStroke = $("#cmbStrokes").val();
        animateFooterText('#strokeFooterValue', selectedStroke + " mm");
        wizardConfiguration[strokeKey] = selectedStroke;
        var productId = wizardConfiguration[productIdKey];
        var selectedForce = wizardConfiguration[forceKey];
        getRodTubes(productId, selectedForce, selectedStroke);
    });


    drawLine(horizontalLineLeft, horizontalLineTop, cmbStrokesLeft, horizontalLineTop, stepCanvas.getContext('2d'), true, false);
    drawLine(cmbStrokesLeft + 80, horizontalLineTop, verticalLineLeft, horizontalLineTop, stepCanvas.getContext('2d'), false, true);

    //Draw the dropdown title
    $('#wizardBody').append($('<strong id="dropDownStrokeTitle">L1</strong>'));
    $('#dropDownStrokeTitle').css('position', 'absolute');
    $('#dropDownStrokeTitle').css('left', cmbStrokesLeft.toString() + 'px');
    $('#dropDownStrokeTitle').css('top', (cmbStrokesTop - 20).toString() + 'px');

    //Animate the select text
    animateSelectionText('selectStroke', "SelectStrokeLengthText", horizontalLineLeft + 170, cmbStrokesTop);
    var selectionTextDescriptor = createSelectionTextDescriptor('selectStroke', "SelectStrokeLengthText", horizontalLineLeft + 170, cmbStrokesTop);
    createStepDescriptor(["strokeFooterValue"], ["selectStroke"], ["cmbStrokes"], ["selectStroke", "cmbStrokes", "dropDownStrokeTitle", "step2Canvas"], selectionTextDescriptor, 1, "Step2Description");
    if (queryStringStroke != null && queryStringStroke != '') {
        $('#cmbStrokes').val(parseInt(queryStringStroke));
        $('#cmbStrokes').change();
    }
}

function rodTubesCompleted(rodTubes) {
    nextStep();
    drawStep3(rodTubes);
}

function drawStep3(rodTubes) {
    var queryStringRod = getQueryStrings()["Rod"];
    var queryStringTube = getQueryStrings()["Tube"];
    wizardConfiguration[springKey] = null;
    var stepCanvas = createCanvas('step3Canvas');
    $('#wizardBody').append($(stepCanvas));

    //Draw the lines
    var tubeLocation = 70;
    var tubeUpperLineTop = imgTop;
    var tubeUpperLineLeft = imgLeft + tubeLocation;
    drawLine(tubeUpperLineLeft, tubeUpperLineTop - 60, tubeUpperLineLeft, tubeUpperLineTop, stepCanvas.getContext('2d'), false, true);

    var tubeLowerLineTop = imgTop + imgHeight;
    var tubeLowerLineLeft = imgLeft + tubeLocation;
    drawLine(tubeLowerLineLeft, tubeLowerLineTop, tubeLowerLineLeft, tubeLowerLineTop + 60, stepCanvas.getContext('2d'), true, false);

    var rodLocation = imgWidth - sptialLength - 10;
    var rodUpperLineTop = imgTop + 15;
    var rodUpperLineLeft = imgLeft + rodLocation;
    if (isTractionProduct())
        rodUpperLineLeft += 20;
    drawLine(rodUpperLineLeft, rodUpperLineTop - 40, rodUpperLineLeft, rodUpperLineTop, stepCanvas.getContext('2d'), false, true);

    var rodLowerLineTop = imgTop + imgHeight - 15;
    var rodLowerLineLeft = imgLeft + rodLocation;
    if (isTractionProduct())
        rodLowerLineLeft += 20;
    drawLine(rodLowerLineLeft, rodLowerLineTop, rodLowerLineLeft, rodLowerLineTop + 40, stepCanvas.getContext('2d'), true, false);

    //Adding Ø1,Ø2 text.
    var rodText = '<strong id="rodText">Ø1</strong>';
    $('#wizardBody').append($(rodText));
    $('#rodText').css('position', 'absolute');
    $('#rodText').css('top', (rodUpperLineTop - 40).toString() + 'px');
    $('#rodText').css('left', (rodLowerLineLeft - 30).toString() + 'px');

    var tubeText = '<strong id="tubeText">Ø2</strong>';
    $('#wizardBody').append($(tubeText));
    $('#tubeText').css('position', 'absolute');
    $('#tubeText').css('top', (tubeUpperLineTop - 60).toString() + 'px');
    $('#tubeText').css('left', (tubeUpperLineLeft + 10).toString() + 'px');

    //Adding the rod/tubes dropdown
    var html = '<select id="cmbRodTubes" class="selector">';
    var selectText = getLocalizedString("RodTubeDropdownSelectText");
    var option = '<option value ="">' + selectText + '</option>';
    html += option;
    for (var i = 0; i < rodTubes.length; i++) {
        var rodTube = rodTubes[i];
        var newOption;
        if (rodTube.Enabled.toString().toLowerCase() == "false") {
            newOption = '<option disabled ' + '>' + rodTube.Text + '</option>';
        }
        else {
            newOption = '<option class="enabledOption" value="' + rodTube.Text + '"' + '>' + rodTube.Text + '</option>';
        }

        html += newOption;
    }
    html += '</select>';
    var cmbRodTubesTop = imgTop + 15;
    var cmbRodTubesLeft = imgLeft + 80;
    $('#wizardBody').append($(html));
    $('#cmbRodTubes').css('position', 'absolute');
    $('#cmbRodTubes').css('left', cmbRodTubesLeft + 'px');
    $('#cmbRodTubes').css('top', cmbRodTubesTop + 'px');
    $('#cmbRodTubes').css('width', '140px');
    $('#cmbRodTubes').change(function () {
        var selectedRodTube = $("#cmbRodTubes").val().toString();
        var values = selectedRodTube.split('/');
        if (values.length == 2) {
            var rod = values[0];
            var tube = values[1];
            animateFooterText('#pistonRodValue', rod + " mm");
            animateFooterText('#tubeFooterValue', tube + " mm");
            getSpring(wizardConfiguration[productIdKey], wizardConfiguration[forceKey], wizardConfiguration[strokeKey], rod, tube);
        }
    });

    //Draw the select text.
    animateSelectionText('selectRodTube', 'SelectRodCylinderSizeText', 0, imgTop - 35);
    var textWidth = imgLeft + tubeLocation - 20;
    var rodTubeSelectTextLeft = tubeUpperLineLeft + 10;
    $('#selectRodTube').css('width', textWidth + 'px');
    $('#selectRodTube').css('left', rodTubeSelectTextLeft + 'px');
    //$('#selectRodTube').css('text-align', 'right');
    var selectionTextDescriptor = createSelectionTextDescriptor('selectRodTube', "SelectRodCylinderSizeText", rodTubeSelectTextLeft, imgTop - 20);
    createStepDescriptor(["pistonRodValue", "tubeFooterValue", "gasSpringValue", "threadSizeFooterValue"], ["selectRodTube"], ["cmbRodTubes"], ["selectRodTube", "cmbRodTubes", "tubeText", "rodText", "step3Canvas"], selectionTextDescriptor, 2, "Step3Description");
    if (queryStringRod != null && queryStringRod != '' && queryStringTube != null && queryStringTube != '') {
        $('#cmbRodTubes').val(parseInt(queryStringRod) + '/' + parseInt(queryStringTube));
        $('#cmbRodTubes').change();
    }
}

function springLoaded(spring) {
    wizardConfiguration[springKey] = spring;
    animateFooterTextWithPrice('#gasSpringValue', spring.ProductNo, false);

    if (isWeldedEyesProduct()) {
        animateFooterText('#welededEyesThinknessValue', spring.Thickness + ' mm');
        animateFooterText('#welededEyesHoleSizeValue', spring.HoleSize + ' mm');
    }
    else {
        animateFooterText('#threadSizeFooterValue', spring.Rod);
    }
    if (isWeldedEyesProduct())
        getBrackets(false);
    else
        //getEndFittings(false);
        getLockingTubes();
}

function pistonRodEndFittingsCompleted(endFittings) {
    nextStep();
    drawStep4(endFittings, true);
}

function drawSpringFigure(stepCanvas) {
    var firstVerticalLineLeft = imgLeft + sptialLength;
    var firstVerticalLineTop = imgTop - 100;
    drawLine(firstVerticalLineLeft, firstVerticalLineTop, firstVerticalLineLeft, imgTop, stepCanvas.getContext('2d'), false, false);
    var secondVerticalLineLeft = imgLeft + imgWidth - sptialLength;
    var secondVerticalLineTop = imgTop - 100;
    drawLine(secondVerticalLineLeft, secondVerticalLineTop, secondVerticalLineLeft, imgTop, stepCanvas.getContext('2d'), false, false);
    $('#wizardBody').append(stepCanvas);
    var horizontalLineLeft = imgLeft + sptialLength;
    var horizontalLineTop = imgTop - 90;
    var lineLength = imgWidth - (23 * 2);
    var lengthLeft = ((firstVerticalLineLeft + secondVerticalLineLeft) / 2 - 35);
    var springLengthHtml = '<div id="threadLength">' + wizardConfiguration[springKey].Length.toFixed(2) + '</div>';
    $('#wizardBody').append($(springLengthHtml));
    $('#threadLength').css('position', 'absolute');
    $('#threadLength').css('text-align', 'center');
    $('#threadLength').css('border', 'black solid 1px');
    $('#threadLength').css('width', '70px');
    $('#threadLength').css('height', '20px');
    $('#threadLength').css('z-index', '10');
    $('#threadLength').css('background-color', 'white');
    $('#threadLength').css('border-radius', '5px');

    $('#threadLength').css('left', lengthLeft + 'px');
    $('#threadLength').css('top', (horizontalLineTop - 10) + 'px');

    drawLine(horizontalLineLeft, horizontalLineTop, lengthLeft, horizontalLineTop, stepCanvas.getContext('2d'), true, false);
    drawLine(lengthLeft + 71, horizontalLineTop, horizontalLineLeft + lineLength, horizontalLineTop, stepCanvas.getContext('2d'), false, true);

}

function drawStep4(endFittings, shouldCreateDescriptor) {
    wizardConfiguration[endFittingKey] = null;
    var stepCanvas = createCanvas('step4Canvas');
    drawSpringFigure(stepCanvas);
    var html = '<div id="pistonRodEndFittings">';
    for (var i = 0; i < endFittings.length; i++) {
        var endFitting = endFittings[i];
        var imgUrl = imagesBaseUrl + endFitting.ImageFile;
        var divId = 'endFitting_' + i;
        html += '<div id="' + divId + '" value="' + endFitting.GroupNo + '" class="endFitting">' + endFitting.Text + '<br>';
        html += '<img src="' + imgUrl + '"/></div>';

    }
    html += '</div>';
    $('#wizardBody').append($(html));
    $('#pistonRodEndFittings').css('position', 'absolute');
    $('#pistonRodEndFittings').css('right', '10px');
    $('#pistonRodEndFittings').css('top', '30px');

    for (i = 0; i < endFittings.length; i++) {
        divId = 'endFitting_' + i;
        $('#' + divId).click(function () { endFittingSelected(this, false); });
    }
    animateFooterText('#totalLengthWithoutThreadsValue', wizardConfiguration[springKey].Length.toFixed(2) + " mm");

    animateSelectionText('selectPistonRodEndFitting', 'SelectEndfittingTypeText', 0, 10, 50);
    if (shouldCreateDescriptor)
        createStepDescriptor(['totalLengthWithoutThreadsValue'], ["pistonRodEndFittings", "selectPistonRodEndFitting"], [], ["selectPistonRodEndFitting", "threadLength", "pistonRodEndFittings", "step4Canvas"], null, 3, "Step4Description", drawStep4, endFittings);
}

function endFittingSelected(selectedEndFitting, isTube) {
    var groupId = $(selectedEndFitting).attr('value');
    if (isTube)
        wizardConfiguration[tubeEndFittingKey] = groupId;
    else
        wizardConfiguration[endFittingKey] = groupId;


    if (isTube && isThreadEndFitting(wizardConfiguration[tubeEndFittingKey]))
        getExtensions();
    else if (!isTube && isThreadEndFitting(wizardConfiguration[endFittingKey])) {
        nextStep();
        getEndFittings(true);
    }
    else
        getEndFittingsMaterials(isTube);
}

function endFittingsMaterialsCompleted(materials) {
    nextStep();
    drawStep5(materials, true);
}

function drawStep5(materials, shouldCreateDescriptor) {
    wizardConfiguration[endFittingMaterialKey] = null;
    var html = '<div id="pistonRodEndFittingsMaterials">';
    for (var i = 0; i < materials.length; i++) {
        var endFittingMaterial = materials[i];
        var imgUrl = imagesBaseUrl + endFittingMaterial.ImageFile;
        var divId = 'endFittingMaterial_' + i;
        html += '<div id="' + divId + '" value="' + endFittingMaterial.MaterialType + '" class="endFitting">' + endFittingMaterial.Title + '<br>';
        html += '<img src="' + imgUrl + '"/></div>';

    }
    html += '</div>';
    $('#wizardBody').append($(html));
    $('#pistonRodEndFittingsMaterials').css('position', 'absolute');
    $('#pistonRodEndFittingsMaterials').css('right', '10px');
    $('#pistonRodEndFittingsMaterials').css('top', '30px');

    for (i = 0; i < materials.length; i++) {
        divId = 'endFittingMaterial_' + i;
        $('#' + divId).click(function () { endFittingMaterialSelected(this, false); });
    }

    animateSelectionText('selectPistonRodEndFittingMaterial', 'SelectEndfittingMaterialText', 0, 10, 50);
    var selectionTextDescriptor = createSelectionTextDescriptor('selectPistonRodEndFittingMaterial', "SelectEndfittingMaterialText", imgLeft + imgWidth, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor([], ["pistonRodEndFittingsMaterials", "selectPistonRodEndFittingMaterial"], [], ["selectPistonRodEndFittingMaterial", "pistonRodEndFittingsMaterials"], selectionTextDescriptor, 4, "Step5Description", drawStep5, materials);
}

function endFittingMaterialSelected(selectedEndFitting, isTube) {
    var selectedValue = $(selectedEndFitting).attr("value");
    if (isTube)
        wizardConfiguration[tubeEndFittingMaterialKey] = selectedValue;
    else
        wizardConfiguration[endFittingMaterialKey] = selectedValue;

    getConfigurationTable(isTube);
}

function pistonRodConfigurationTableCompleted(confiugrationTable) {
    nextStep();
    drawStep6(confiugrationTable, true);
}

function drawStep6(configurationTable, shouldCreateDescriptor) {
    wizardConfiguration[pistonRodEndFittingsTableKey] = configurationTable;
    wizardConfiguration[endFittingConfigurationKey] = null;
    var illustrationImgUrl = imagesBaseUrl + configurationTable.EndFittingImage;
    var imgHtml = '<img id="imgEndFittingIllustration" src="' + illustrationImgUrl + '"/>';
    $('#wizardBody').append($(imgHtml));
    $('#imgEndFittingIllustration').css('position', 'absolute');
    $('#imgEndFittingIllustration').css('top', '10px');
    $('#imgEndFittingIllustration').css('right', '50px');

    var tableHtml = '<div id="configurationContainer"><div id="table-wrapper"><div id="table-scroll"><table id="configurationTable" class="tablesorter"></table></div></div></div>';
    $('#wizardBody').append($(tableHtml));
    $('#configurationContainer').css('position', 'absolute');
    $('#configurationContainer').css('top', (imgTop + imgHeight) + 'px');
    $('#configurationContainer').css('right', '10px');
    $('#configurationTable').append('<thead><tr id="headerRow"><th class="broderlessCell"></th></tr></thead>');

    var tableHeaders = configurationTable.TableHeaders;
    for (var i = 0; i < tableHeaders.length; i++) {
        var header = tableHeaders[i].toString();
        header = header.replace(' - ', '<br/>');
        var html = '<th><span class="text">' + header + '</span></th>';
        $('#headerRow').append($(html));
    }

    for (var j = 0; j < configurationTable.Items.length; j++) {
        var row = configurationTable.Items[j].RowValues;
        var valuesHtml = '<tr><td class="broderlessCell"><input data="' + j + '" type="radio" name="endFittingRowValues"/></td>';
        for (var k = 0; k < row.length; k++) {
            var endFittingId = '<span>' + configurationTable.Items[j].ItemNo + '</span><br/>';
            var toolTip = "title=\"" + endFittingId + "<img src='" + imagesBaseUrl + configurationTable.Items[j].RodImageUrl + "'/>\"";
            valuesHtml += '<td data="' + j + '" ' + toolTip + '><span>' + row[k] + '</span></td>';
        }
        valuesHtml += '</tr>';
        $('#configurationTable').append(valuesHtml);
    }
    $("#configurationTable").tablesorter();
    applyTooltip();
    addClickHandler(false);
    animateSelectionText('selectEndFitting', 'SelectEndfittingValuesText', 0, 10, 50);
    if (shouldCreateDescriptor)
        createStepDescriptor(["endFitting1FooterValue"], ["selectEndFitting", "configurationContainer", "imgEndFittingIllustration"], [], ["selectEndFitting", "configurationContainer", "imgPistonRodEndFitting", "imgEndFittingIllustration", "totalThreadLength", "step6Canvas", "pistonRodEndFittingLength", "imgPistonRodEndFitting2"], null, 5, "Step6Description", drawStep6, configurationTable);
}

function addClickHandler(isTube) {
    $("#configurationTable").find('tr').click(function () {
        var index = $(this).find('input').attr('data');
        var selectedConfiguration = isTube ? wizardConfiguration[tubeEndFittingsTableKey].Items[index] : wizardConfiguration[pistonRodEndFittingsTableKey].Items[index];
        if (isTube)
            wizardConfiguration[tubeEndFittingConfigurationKey] = selectedConfiguration;
        else
            wizardConfiguration[endFittingConfigurationKey] = selectedConfiguration;
        var endFittingImgUrl = imagesBaseUrl + (isTube ? selectedConfiguration.TubeImageUrl : selectedConfiguration.RodImageUrl);
        var tubeImgWidth = $('#imgTubeEndFitting').width();
        var imgId = isTube ? "imgTubeEndFitting" : "imgPistonRodEndFitting";
        var imgHtml = '<img id="' + imgId + '" src="' + endFittingImgUrl + '"/>';
        $('#wizardBody').append(imgHtml);
        $('#' + imgId).css('position', 'absolute');
        $('#' + imgId).css('left', ((isTube ? (imgLeft - tubeImgWidth + sptialLength) : ((imgLeft + imgWidth) - sptialLength)) + 'px'));
        $('#' + imgId).css('top', (imgTop) + 'px');
        if (isTractionProduct() && !isTube) {
            var virtualWidth = 500;
            var imgTransparent = '<img id="imgPistonRodEndFitting2" src="' + endFittingImgUrl + '"/>';
            $('#wizardBody').append(imgTransparent);
            $('#imgPistonRodEndFitting2').css('position', 'absolute');
            $('#imgPistonRodEndFitting2').css('left', (imgLeft + virtualWidth - sptialLength) + 'px');
            $('#imgPistonRodEndFitting2').css('top', (imgTop) + 'px');
            $('#imgPistonRodEndFitting2').css('opacity', '0.6');
            $('#imgPistonRodEndFitting2').css('filter', 'alpha(opacity=60)');
        }
        $(this).find('input').prop("checked", true);
        if (isTube) {
            animateFooterTextWithPrice('#endFitting2FooterValue', selectedConfiguration.ItemNo, true);
            $('#imgTubeEndFitting').hide();
        }
        else {
            animateFooterTextWithPrice('#endFitting1FooterValue', selectedConfiguration.ItemNo, true);
            appendPistonEndFittingLines();
        }
        getBrackets(isTube);
        computeTotalProductLength();
    });
}

function appendPistonEndFittingLines() {
    var canvas = createCanvas('step6Canvas');
    var pixelCenter = wizardConfiguration[endFittingConfigurationKey].PixelCenter;
    var verticalLineStartX = imgLeft + imgWidth + pixelCenter - sptialLength;
    var verticalLineY = imgTop;
    drawLine(verticalLineStartX, verticalLineY, verticalLineStartX, verticalLineY - 145, canvas.getContext('2d'), false, false);

    var horizontalLineX = imgLeft + tubeSptialLength;
    var horizontalLineY = imgTop - 125;
    $('#wizardBody').append(canvas);

    var horizontalLocation = imgLeft + imgWidth / 2;
    createLengthBox('totalThreadLength', getTotalProductLength().toFixed(2), 70, horizontalLineY - 10, horizontalLocation - 35);
    drawLine(horizontalLineX, horizontalLineY, horizontalLocation - 35, horizontalLineY, canvas.getContext('2d'), false, false);
    drawLine(horizontalLocation - 35 + 71, horizontalLineY, verticalLineStartX, horizontalLineY, canvas.getContext('2d'), false, true);

    var endFittingHorizontalLineLeft = imgLeft + imgWidth - sptialLength;
    var endFittingHorizontalLineTop = imgTop - 90;
    drawLine(endFittingHorizontalLineLeft, endFittingHorizontalLineTop, endFittingHorizontalLineLeft + pixelCenter, endFittingHorizontalLineTop, canvas.getContext('2d'), true, true);
    var rodLength = wizardConfiguration[endFittingConfigurationKey] == null ? 0 : wizardConfiguration[endFittingConfigurationKey].RowValues[0];
    createLengthBox('pistonRodEndFittingLength', rodLength, 20, endFittingHorizontalLineTop - 25, endFittingHorizontalLineLeft + (pixelCenter / 2 - 10));
}

function createLengthBox(id, content, width, top, left) {
    var springLengthHtml = '<div class="lengthBox" id="' + id + '">' + content + '</div>';
    $('#wizardBody').append($(springLengthHtml));
    $('#' + id).css('z-index', '10');
    $('#' + id).css('width', width + 'px');
    $('#' + id).css('left', left + 'px');
    $('#' + id).css('top', top + 'px');
}

function getBracketsCompleted(brackets) {
    if (brackets.length > 0) {
        nextStep();
        drawStep7(brackets, true);
    }
    else {
        nextStep();
        if (isWeldedEyesProduct())
            getBrackets(true);
        else
            getEndFittings(true);
    }
}

function drawStep7(brackets, shouldCreateDescriptor) {
    if (isWeldedEyesProduct()) {
        drawSpringFigure(createCanvas('step7Canvas'));
        animateFooterText('#totalLengthWithoutThreadsValue', wizardConfiguration[springKey].Length.toFixed(2) + " mm");
    }
    wizardConfiguration[pistonRodBracketKey] = null;
    var htmlBracketsList = '<div id="bracketsContainer" class="container">';
    htmlBracketsList += createNoBracketOption();
    for (var i = 0; i < brackets.length; i++) {
        var bracket = brackets[i];
        var htmlBracket = '<div class="scrollableEndFitting">' + createInfoButton(bracket.ItemNo);
        var bracketImg = imagesBaseUrl + bracket.ImageFile;
        htmlBracket += '<img class="imgBracket" width="50" height="50" src="' + bracketImg + '" itemNo="' + bracket.ItemNo + '" title="' + bracket.Text + '"/>';
        htmlBracket += '</div>';
        htmlBracketsList += htmlBracket;
    }
    htmlBracketsList += "</div>";
    $('#wizardBody').append(htmlBracketsList);
    $('#bracketsContainer').css('position', 'absolute');
    $('#bracketsContainer').css('right', '10px');
    $('#bracketsContainer').css('top', '30px');
    addBracketClickHandler(false);
    animateSelectionText('selectBracket', 'SelectBracketTypeText', 0, 10, 50);
    if (shouldCreateDescriptor) {
        if (isWeldedEyesProduct())
            createStepDescriptor(["braketRodFooterValue", "totalLengthWithoutThreadsValue"], ["selectBracket", "bracketsContainer"], [], ["threadLength", "step7Canvas", "selectBracket", "bracketsContainer", "imgRodBracket"], null, 6, "Step10Description", drawStep7, brackets);
        else
            createStepDescriptor(["braketRodFooterValue"], ["selectBracket", "bracketsContainer"], [], ["selectBracket", "bracketsContainer", "imgRodBracket"], null, 6, "Step10Description", drawStep7, brackets);

    }
}

function addBracketClickHandler(isTube) {
    $('#bracketsContainer').find('span').click(function () {
        bracketSelected(null, null, isTube);
    });

    $('.imgBracket').click(function () {
        var itemNo = $(this).attr('itemNo');
        var radioButton = $(this).parent().find('#' + itemNo);
        $(radioButton).prop('checked', true);
        bracketSelected(itemNo, $(this).attr('src'), isTube);
    });
}

function bracketSelected(itemNo, url, isTube) {
    if (isTube) {
        if (itemNo != undefined && itemNo != null) {
            wizardConfiguration[tubeBracketKey] = itemNo;
            animateFooterTextWithPrice('#bracketTubeFooterValue', itemNo, true);
        }
        getExtensions();
    }
    else {
        if (itemNo != undefined && itemNo != null) {
            wizardConfiguration[pistonRodBracketKey] = itemNo;
            animateFooterTextWithPrice('#braketRodFooterValue', itemNo, true);
        }
        if (isWeldedEyesProduct())
            getBrackets(true);
        else {
            nextStep();
            getEndFittings(true);
        }
    }
    if (itemNo != null && itemNo != undefined) {
        appendBracketImage(url, isTube);
    }
}

function appendBracketImage(src, isTube) {
    var imgId = isTube ? "imgTubeBracket" : "imgRodBracket";
    var html = '<img id="' + imgId + '" src="' + src + '" />';
    $('#wizardBody').append(html);
    $('#' + imgId).css('position', 'absolute');
    if (isTube) {
        $('#' + imgId).css('left', '10px');
        $('#' + imgId).css('top', imgTop + 20 + 'px');
    }
    else {
        $('#' + imgId).css('right', '10px');
        $('#' + imgId).css('top', imgTop + 'px');
    }
    if (isTube)
        $('#imgTubeBracket').hide();
}

function tubeEndFittingsCompleted(endFittings) {
    drawStep8(endFittings, true);
}

function drawStep8(endFittings, shouldCreateDescriptor) {
    wizardConfiguration[tubeEndFittingKey] = null;
    var html = '<div id="tubeEndFittings">';
    for (var i = 0; i < endFittings.length; i++) {
        var endFitting = endFittings[i];
        var imgUrl = imagesBaseUrl + endFitting.TubeImageFile;
        var divId = 'endFitting_' + i;
        html += '<div id="' + divId + '" value="' + endFitting.GroupNo + '" class="endFitting">' + endFitting.Text + '<br>';
        html += '<img src="' + imgUrl + '"/></div>';

    }
    html += '</div>';
    $('#wizardBody').append($(html));
    $('#tubeEndFittings').css('position', 'absolute');
    $('#tubeEndFittings').css('left', '30px');
    $('#tubeEndFittings').css('top', '30px');

    for (i = 0; i < endFittings.length; i++) {
        divId = 'endFitting_' + i;
        $('#' + divId).click(function () { endFittingSelected(this, true); });
    }
    animateSelectionText('selectTubeEndFitting', 'SelectEndfittingTypeText', 30, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor([], ["tubeEndFittings", "selectTubeEndFitting"], [], ["selectTubeEndFitting", "tubeEndFittings"], null, 7, "Step7Description", drawStep8, endFittings);

}

function tubeEndFittingSelected(selectedEndFitting) {
    $(selectedEndFitting).find('input').prop("checked", true);
    wizardConfiguration[tubeEndFittingKey] = $(selectedEndFitting).find('input').prop('value');
    getEndFittingsMaterials(true);
}

function tubeEndFittingsMaterialsCompleted(materials) {
    nextStep();
    drawStep9(materials, true);
}

function drawStep9(materials, shouldCreateDescriptor) {
    wizardConfiguration[tubeEndFittingMaterialKey] = null;
    var html = '<div id="tubeEndFittingsMaterials">';
    for (var i = 0; i < materials.length; i++) {
        var endFittingMaterial = materials[i];
        var imgUrl = imagesBaseUrl + endFittingMaterial.TubeImageFile;
        var divId = 'endFittingMaterial_' + i;
        html += '<div id="' + divId + '" value="' + endFittingMaterial.MaterialType + '" class="endFitting">' + endFittingMaterial.Title + '<br>';
        html += '<img src="' + imgUrl + '"/></div>';

    }
    html += '</div>';
    $('#wizardBody').append($(html));
    $('#tubeEndFittingsMaterials').css('position', 'absolute');
    $('#tubeEndFittingsMaterials').css('left', '30px');
    $('#tubeEndFittingsMaterials').css('top', '30px');

    for (i = 0; i < materials.length; i++) {
        divId = 'endFittingMaterial_' + i;
        $('#' + divId).click(function () { endFittingMaterialSelected(this, true); });
    }

    animateSelectionText('selectTubeEndFittingMaterial', 'SelectEndfittingMaterialText', 30, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor([], ["tubeEndFittingsMaterials", "selectTubeEndFittingMaterial"], [], ["selectTubeEndFittingMaterial", "tubeEndFittingsMaterials"], null, 8, "Step8Description", drawStep9, materials);
}

function tubeConfigurationTableCompleted(confiugrationTable) {
    nextStep();
    drawStep10(confiugrationTable, true);
}

function drawStep10(configurationTable, shouldCreateDescriptor) {
    wizardConfiguration[tubeEndFittingsTableKey] = configurationTable;
    wizardConfiguration[tubeEndFittingConfigurationKey] = null;
    var illustrationImgUrl = imagesBaseUrl + configurationTable.TubeImage;
    var imgHtml = '<img id="imgEndFittingIllustration" src="' + illustrationImgUrl + '"/>';
    $('#wizardBody').append($(imgHtml));
    $('#imgEndFittingIllustration').css('position', 'absolute');
    $('#imgEndFittingIllustration').css('top', '10px');
    $('#imgEndFittingIllustration').css('left', '30px');

    var tableHtml = '<div id="configurationContainer"><div id="table-wrapper"><div id="table-scroll"><table id="configurationTable" class="tablesorter"></table></div></div></div>';
    $('#wizardBody').append($(tableHtml));
    $('#configurationContainer').css('position', 'absolute');
    $('#configurationContainer').css('top', (imgTop + imgHeight) + 'px');
    $('#configurationContainer').css('left', '30px');
    $('#configurationTable').append('<thead><tr id="headerRow"><th class="broderlessCell"></th></tr></thead>');

    var tableHeaders = configurationTable.TableHeaders;
    for (var i = 0; i < tableHeaders.length; i++) {
        var header = tableHeaders[i].toString();
        header = header.replace(' - ', '<br/>');
        var html = '<th><span class="text">' + header + '</span></th>';
        $('#headerRow').append($(html));
    }

    for (var j = 0; j < configurationTable.Items.length; j++) {
        var row = configurationTable.Items[j].RowValues;
        var valuesHtml = '<tr><td class="broderlessCell"><input data="' + j + '" type="radio" name="endFittingRowValues"/></td>';
        for (var k = 0; k < row.length; k++) {
            var endFittingId = '<span>' + configurationTable.Items[j].ItemNo + '</span><br/>';
            var toolTip = "title=\"" + endFittingId + "<img src='" + imagesBaseUrl + configurationTable.Items[j].TubeImageUrl + "'/>\"";
            valuesHtml += '<td data="' + j + '" ' + toolTip + '><span>' + row[k] + '</span></td>';
        }
        valuesHtml += '</tr>';
        $('#configurationTable').append(valuesHtml);
    }
    $("#configurationTable").tablesorter();
    applyTooltip();
    addClickHandler(true);
    animateSelectionText('selectEndFitting', 'SelectEndfittingValuesText', 30, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor(["endFitting2FooterValue"], ["selectEndFitting", "configurationContainer", "imgEndFittingIllustration"], [], ["selectEndFitting", "configurationContainer", "imgTubeEndFitting", "imgEndFittingIllustration", "tubeEndFittingLength", "step10Canvas"], null, 9, "Step9Description", drawStep10, configurationTable);
}

function getTubeBracketsCompleted(brackets) {
    if (brackets.length > 0) {
        nextStep();
        drawStep11(brackets, true);
    }
    else {
        getExtensions();
    }
}

function drawStep11(brackets, shouldCreateDescriptor) {
    wizardConfiguration[tubeBracketKey] = null;
    var htmlBracketsList = '<div id="bracketsContainer" class="container">';
    htmlBracketsList += createNoBracketOption();
    for (var i = 0; i < brackets.length; i++) {
        var bracket = brackets[i];
        var htmlBracket = '<div class="scrollableEndFitting">' + createInfoButton(bracket.ItemNo);
        var bracketImg = imagesBaseUrl + bracket.ImageFile;
        htmlBracket += '<img class="imgBracket" width="50" height="50" src="' + bracketImg + '" itemNo="' + bracket.ItemNo + '" title="' + bracket.Text + '"/>';
        htmlBracket += '</div>';
        htmlBracketsList += htmlBracket;
    }
    htmlBracketsList += "</div>";
    $('#wizardBody').append(htmlBracketsList);
    $('#bracketsContainer').css('position', 'absolute');
    $('#bracketsContainer').css('left', '30px');
    $('#bracketsContainer').css('top', '30px');
    addBracketClickHandler(true);
    animateSelectionText('selectBracket', 'SelectBracketTypeText', 30, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor(["bracketTubeFooterValue"], ["selectBracket", "bracketsContainer"], [], ["selectBracket", "bracketsContainer", "imgTubeBracket"], null, 10, "Step10Description", drawStep11, brackets);
}

function getExtensionsCompleted(extensions) {
    if (extensions.length > 1) {
        $('#imgTubeBracket').hide();
        nextStep();
        drawStep12(extensions, true);
    }
    else
        endWizard();
}

function drawStep12(extensions, shouldCreateDescriptor) {
    wizardConfiguration[extensionKey] = null;
    wizardConfiguration[extensionLengthKey] = null;
    var htmlExtensionsList = '<div id="extensionsContainer" class="container">';
    htmlExtensionsList += createNoExtensionOption();
    for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];
        var htmlExtension = '<div class="scrollableEndFitting">' + createInfoButton(extension.ItemNo);
        var extensionImg = imagesBaseUrl + extension.ImageFile;
        htmlExtension += '<img class="imgBracket" width="50" height="50" src="' + extensionImg + '" itemNo="' + extension.ItemNo + '" title="' + extension.Text + '" length="' + extension.Length + '"/>';
        htmlExtension += '</div>';
        htmlExtensionsList += htmlExtension;

    }
    htmlExtensionsList += "</div>";
    $('#wizardBody').append(htmlExtensionsList);
    $('#extensionsContainer').css('position', 'absolute');
    $('#extensionsContainer').css('left', '30px');
    $('#extensionsContainer').css('top', '30px');
    addExtensionClickHandler();
    animateSelectionText('selectExtension', 'SelectExtensionText', 30, 10);
    if (shouldCreateDescriptor)
        createStepDescriptor(["extensionFooterValue"], ["selectExtension", "extensionsContainer"], [], ["selectExtension", "extensionsContainer", "extensionImg"], null, 11, "Step12Description", drawStep12, extensions);
}

function addExtensionClickHandler() {
    $('#extensionsContainer').find('input').click(function () {
        var itemNo = $(this).attr('id');
        var length = $(this).attr('length');
        var imageFile = $(this).attr('imageFile');
        extensionSelected(itemNo, imagesBaseUrl + imageFile, length);
    });

    $('#extensionsContainer').find('span').click(function () {
        extensionSelected(null, null, null);
    });

    $('.imgBracket').click(function () {
        var itemNo = $(this).attr('itemNo');
        var length = $(this).attr('length');
        var radioButton = $(this).parent().find('#' + itemNo);
        $(radioButton).prop('checked', true);
        extensionSelected(itemNo, $(this).attr('src'), length);
    });
}

function extensionSelected(itemNo, url, extensionLength) {
    if (itemNo != null) {
        appendExtensionImage(url);
        animateFooterTextWithPrice('#extensionFooterValue', itemNo, true);
        wizardConfiguration[extensionLengthKey] = extensionLength;
        wizardConfiguration[extensionKey] = itemNo;
    }
    computeTotalProductLength();
    endWizard();
}


function drawLockingTubesStep(lockingTubes, shouldCreateDescriptor) {
    var htmlLockingTubesPrefererence = '<div id="lockingTubesContainer" class="container" style="height:100%;width:auto;max-width:150px;">';
    if (lockingTubes[0].IsBellow == false) {
        wizardConfiguration[lockingTubeKey] = null;
        var lockingTubeImgPath = imagesBaseUrl + lockingTubeOverviewImage;
        htmlLockingTubesPrefererence += '<strong style="display:block;">' + getLocalizedString("LockingTubes") + '</strong>';
        htmlLockingTubesPrefererence += '<img src="' + lockingTubeImgPath + '" width="100px" />';
        htmlLockingTubesPrefererence += '<input type="button" id="btnAddLockingTube" class="lockingTubeButton" value="' + getLocalizedString("Yes") + '"/>';
        htmlLockingTubesPrefererence += '<input type="button" class="lockingTubeButton" onclick="hideLockingTubes()" value="' + getLocalizedString("ThankYou") + '"/>';
        htmlLockingTubesPrefererence += '<input type="button"  class="lockingTubeButton" onclick="openLockingTubeHelp(' + "'LockingTubeHelpLink'" + ')" value="' + getLocalizedString("WhatIsIt") + '"/>';
    }
    var hasBellow = checkBellowInList(lockingTubes);
    if (hasBellow) {
        //Bellows
        var bellowImgPath = imagesBaseUrl + bellowOverviewImage;
        htmlLockingTubesPrefererence += '<br/><strong style="display:block;">' + getLocalizedString("Bellows") + '</strong>';
        htmlLockingTubesPrefererence += '<img src="' + bellowImgPath + '" width="100px" />';
        htmlLockingTubesPrefererence += '<input type="button" id="btnAddBellow" class="lockingTubeButton" value="' + getLocalizedString("Yes") + '"/>';
        htmlLockingTubesPrefererence += '<input type="button" class="lockingTubeButton" onclick="hideLockingTubes()" value="' + getLocalizedString("ThankYou") + '"/>';
        htmlLockingTubesPrefererence += '<input type="button"  class="lockingTubeButton" onclick="openLockingTubeHelp(' + "'BellowHelpLink'" + ')" value="' + getLocalizedString("WhatIsIt") + '"/>';
    }

    htmlLockingTubesPrefererence += "</div>";
    $('#wizardBody').append(htmlLockingTubesPrefererence);
    $('#lockingTubesContainer').css('position', 'absolute');
    $('#lockingTubesContainer').css('right', '10px');
    $('#lockingTubesContainer').css('top', '10px');
    if (lockingTubes[0].IsBellow == false) {
        addLockingTubeButtonHandler(lockingTubes[0]);
    }
    if (hasBellow) {
        var index = lockingTubes.length == 1 ? 0 : 1;
        addBellowButtonHandler(lockingTubes[index]);
    }
    if (shouldCreateDescriptor) {
        if (hasBellow)
            createStepDescriptor(["lockingTubeFooterValue", "bellowFooterValue"], ["lockingTubesContainer"], [], ["lockingTubesContainer", "lockingTubeImg"], null, 3, "LockingTubeStepDescription", drawLockingTubesStep, lockingTubes);
        else if (lockingTubes[0].IsBellow == false)
            createStepDescriptor(["lockingTubeFooterValue"], ["lockingTubesContainer"], [], ["lockingTubesContainer", "lockingTubeImg"], null, 3, "LockingTubeStepDescription", drawLockingTubesStep, lockingTubes);
    }
}
function checkBellowInList(lockingTubes) {
    for (var i = 0; i < lockingTubes.length; i++) {
        if (lockingTubes[i].IsBellow) return true;
    }
    return false;
}
function addLockingTubeButtonHandler(lockingTube) {
    $("#btnAddLockingTube").click(function () {
        var src = imagesBaseUrl + lockingTube.ImageFile;
        var html = '<img id="lockingTubeImg" src="' + src + '" />';
        $('#wizardBody').append(html);
        $('#lockingTubeImg').css('position', 'absolute');
        $('#lockingTubeImg').css('left', '496px');
        $('#lockingTubeImg').css('top', '134px');
        wizardConfiguration[lockingTubeKey] = lockingTube.ItemNo;
        wizardConfiguration[bellowKey] = '';
        animateFooterTextWithPrice('#lockingTubeFooterValue', lockingTube.ItemNo, false);
        $('#bellowFooterValue').html("");
        getEndFittings(false);
    });
}

function addBellowButtonHandler(bellow) {
    $("#btnAddBellow").click(function () {
        var src = imagesBaseUrl + bellow.ImageFile;
        var html = '<img id="lockingTubeImg" src="' + src + '" />';
        $('#wizardBody').append(html);
        $('#lockingTubeImg').css('position', 'absolute');
        $('#lockingTubeImg').css('left', '450px');
        $('#lockingTubeImg').css('top', '134px');
        wizardConfiguration[bellowKey] = bellow.ItemNo;
        wizardConfiguration[lockingTubeKey] = '';
        animateFooterTextWithPrice('#bellowFooterValue', bellow.ItemNo, false);
        $('#lockingTubeFooterValue').html("");
        getEndFittings(false);
    });
}

function openLockingTubeHelp(urlKeyValue) {
    var url = getLocalizedString(urlKeyValue);
    var popUpObj = window.open(url,
        "ModalPopUp",
        "toolbar=no," +
        "scrollbars=no," +
        "location=no," +
        "statusbar=no," +
        "menubar=no," +
        "resizable=1," +
        "width=500," +
        "height=500," +
        "left = 100," +
        "top=100"
        );
    //var win = window.open(url, '_blank');
    popUpObj.focus();
}

function hideLockingTubes() {
    wizardConfiguration[lockingTubeKey] = '';
    wizardConfiguration[bellowKey] = '';
    getEndFittings(false);
}

function getLockingTubesCompleted(lockingTubes) {
    if (lockingTubes.length > 0) {
        nextStep();
        drawLockingTubesStep(lockingTubes, true);
    } else {
        getEndFittings(false);
    }
}

function appendExtensionImage(src) {
    var html = '<img id="extensionImg" src="' + src + '" />';
    $('#wizardBody').append(html);
    $('#extensionImg').css('position', 'absolute');
    $('#extensionImg').css('left', (imgLeft + tubeSptialLength - 76) + 'px');
    $('#extensionImg').css('top', (imgTop - 25) + 'px');

}

function createNoExtensionOption() {
    var html = '<div class="noneOption">';
    var title = getLocalizedString("NoExtensionText");
    html += '<span>' + title + '</span>';
    html += '</div>';
    return html;
}

function createInfoButton(itemNo) {
    var infoImage = imagesBaseUrl + "info.png";
    var url = "#";
    if (itemNo != null || itemNo != undefined)
        url = 'http://www.industrial-springs.com/pdf/' + itemNo + '.pdf';
    var html = '<a target="_blank" href="' + url + '"><img width="24" height="24" src="' + infoImage + '"/></a>';
    return html;
}

function createNoBracketOption() {
    var html = '<div class="noneOption">';
    var title = getLocalizedString("NoBracketText");
    html += '<span>' + title + '</span>';
    html += '</div>';
    return html;
}

function applyTooltip() {
    $(function () {
        $.widget("ui.tooltip", $.ui.tooltip, {
            options: {
                content: function () {
                    return $(this).prop('title');
                }
            }
        });

        $('#configurationTable').tooltip({
            track: true,
            position: { my: "left+15 top", at: "right top" }
        });
    });

}

function createCanvas(id) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    canvas.setAttribute('width', 900);
    canvas.setAttribute('height', 320);
    return canvas;
}

function animateFooterText(footerId, footerTitle) {
    $(footerId).fadeOut("slow", function () {
        $(this).html(footerTitle);
        $(footerId).fadeIn("slow");
    });
}

function animateFooterTextWithPrice(footerId, footerValue, hasPdf) {
    $(footerId).fadeOut("slow", function () {
        var priceText = getLocalizedString("PricesButton");
        var url = pdfUrl + footerValue + '.pdf';
        var html = "";
        if (hasPdf) {
            html = '<div class="footerValueWithPrice"><a target="_blank" href="' + url + '"><img class="footerInfoImg"/></a> <span>' + footerValue + '</span><input type="button" onclick="openPriceList(\'' + footerValue + '\')" value="' + priceText + '" /></div>';
        }
        else {
            html = '<div class="footerValueWithPrice"><span>' + footerValue + '</span><input type="button" onclick="openPriceList(\'' + footerValue + '\')" value="' + priceText + '" /></div>';
        }

        $(this).html(html);
        $(footerId).fadeIn("slow");
    });
}

function animateSelectionText(id, localizationKey, left, top, right) {
    $('#wizardBody').append($('<strong id="' + id + '">' + getLocalizedString(localizationKey) + '</strong>'));
    $('#' + id).css('position', 'absolute');
    $('#' + id).css('display', 'none');
    if (left > 0)
        $('#' + id).css('left', left.toString() + 'px');
    if (right > 0)
        $('#' + id).css('right', right.toString() + 'px');
    $('#' + id).css('top', top.toString() + 'px');
    $('#' + id).fadeIn("slow", null);
}

function createSelectionTextDescriptor(id, localizationKey, left, top) {
    return { "id": id, "localizationKey": localizationKey, "left": left, "top": top };
}

function drawLine(x1, y1, x2, y2, context, hasStartArrow, hasEndArrow) {
    var verticalLine = false;
    if (y1 != y2) {
        verticalLine = true;
    }
    if (hasStartArrow && !verticalLine) {
        x1 += 16;
    }
    if (hasEndArrow && !verticalLine) {
        x2 -= 16;
    }
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.fillStyle = context.strokeStyle;
    if (verticalLine) {
        if (hasStartArrow) {
            y1 += 16;
        }
        if (hasEndArrow) {
            y2 -= 16;
        }
    }

    if (verticalLine) {
        if (hasStartArrow) {
            context.moveTo(x1, y1);
            context.lineTo(x1 - 4, y1);
            context.lineTo(x1, y1 - 16);
            context.lineTo(x1 + 4, y1);
            context.lineTo(x1, y1);
            context.fill();
        }
        if (hasEndArrow) {
            context.moveTo(x2, y2);
            context.lineTo(x2 - 4, y2);
            context.lineTo(x2, y2 + 16);
            context.lineTo(x2 + 4, y2);
            context.lineTo(x2, y2);
            context.fill();
        }
    }
    else {
        if (hasStartArrow) {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x1, y1 - 4);
            context.lineTo(x1 - 16, y1);
            context.lineTo(x1, y1 + 4);
            context.lineTo(x1, y1);
            context.fill();
        }

        if (hasEndArrow) {
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(x2, y2 - 4);
            context.lineTo(x2 + 16, y2);
            context.lineTo(x2, y2 + 4);
            context.lineTo(x2, y2);
            context.fill();
        }
    }
}

function createStepDescriptor(footerControls, stepVisibleControls, selectors, allControls, selectTextDescriptor, stepIndex, stepDescriptionKey, redrawFunction, args) {
    var descriptor = { "StepIndex": stepIndex, "FooterControls": footerControls, "VisibleControls": stepVisibleControls, "StepControls": selectors, "AllControls": allControls, "SelectTextDescriptor": selectTextDescriptor, "Redraw": redrawFunction, "Args": args, "StepKey": stepDescriptionKey };
    wizardDescriptors.push(descriptor);
    setStepDescription();
    log('Step Pushed, Index=' + stepIndex + ' ,Steps Count =' + wizardDescriptors.length + " ,Current Index = " + wizardCurrentStepIndex);
}

function appendTubeFittingLines() {
    var isTubeHasThreadEnd = isThreadEndFitting(wizardConfiguration[tubeEndFittingKey]);
    var isRodHasThreadEnd = isThreadEndFitting(wizardConfiguration[endFittingKey]);
    var endFittingImgWidth = $('#imgTubeEndFitting').width();
    var canvas = createCanvas('lastStepCanvas');
    var extensionImageContentLength = 51;
    $('#totalThreadLength').html(getTotalProductLength().toFixed(2));
    $('#wizardBody').append(canvas);
    var hasExtension = wizardConfiguration[extensionLengthKey] != null && wizardConfiguration[extensionLengthKey] != undefined;
    var pixelCenter = wizardConfiguration[tubeEndFittingConfigurationKey] != null ? wizardConfiguration[tubeEndFittingConfigurationKey].PixelCenter : 0;
    if (hasExtension) {
        $('#imgTubeEndFitting').css('z-index', '10');
        $('#imgTubeEndFitting').css('left', (imgLeft + tubeSptialLength + tubeSptialLength - 76 - endFittingImgWidth) + 'px');

        var verticalLineStartX = imgLeft - extensionImageContentLength + tubeSptialLength;
        var verticalLineY = imgTop;
        //canvas.getContext('2d').strokeStyle = '#ff0000';
        drawLine(verticalLineStartX, verticalLineY, verticalLineStartX, verticalLineY - 100, canvas.getContext('2d'), false, false);

        //var endFittingHorizontalLineLeft = imgLeft - sptialLength;
        var endFittingHorizontalLineTop = imgTop - 90;
        //canvas.getContext('2d').strokeStyle = '#00ff00';
        drawLine(verticalLineStartX, endFittingHorizontalLineTop, verticalLineStartX + extensionImageContentLength, endFittingHorizontalLineTop, canvas.getContext('2d'), true, true);

        var extensionLength = wizardConfiguration[extensionLengthKey];
        createLengthBox('extensionLength', extensionLength, 20, endFittingHorizontalLineTop - 25, verticalLineStartX + (extensionImageContentLength / 2 - 10));
    }
    else if (!isTubeHasThreadEnd) {
        $('#imgTubeEndFitting').css('z-index', '10');
        $('#imgTubeEndFitting').css('left', (imgLeft + tubeSptialLength - endFittingImgWidth) + 'px');
    }
    if (hasExtension || !isTubeHasThreadEnd) {
        verticalLineStartX = hasExtension ? imgLeft - pixelCenter - extensionImageContentLength + tubeSptialLength : imgLeft - pixelCenter + tubeSptialLength;
        verticalLineY = imgTop;
        //canvas.getContext('2d').strokeStyle = '#0000ff';
        drawLine(verticalLineStartX, verticalLineY, verticalLineStartX, verticalLineY - 145, canvas.getContext('2d'), false, false);

        var horizontalLineY = imgTop - 125;
        var horizontalLineLength = hasExtension ? verticalLineStartX + pixelCenter + extensionImageContentLength : verticalLineStartX + pixelCenter;
        if (!isRodHasThreadEnd) {
            //canvas.getContext('2d').strokeStyle = '#00FFFF';
            drawLine(verticalLineStartX, horizontalLineY, horizontalLineLength, horizontalLineY, canvas.getContext('2d'), true, false);
        }
        else {
            //Draw the line to the end of the spring.
            //canvas.getContext('2d').strokeStyle = '#00FFFF';
            drawLine(verticalLineStartX, horizontalLineY, imgLeft + imgWidth - sptialLength, horizontalLineY, canvas.getContext('2d'), true, true);
            //draw the remainting part of the vertical line
            var secondVerticalLineLeft = imgLeft + imgWidth - sptialLength;
            var secondVerticalLineTop = imgTop - 145;
            //canvas.getContext('2d').strokeStyle = '#F4A460';
            drawLine(secondVerticalLineLeft, secondVerticalLineTop, secondVerticalLineLeft, imgTop - 100, canvas.getContext('2d'), false, false);


            var horizontalLineX = imgLeft + tubeSptialLength;
            //canvas.getContext('2d').strokeStyle = '#006400';
            //drawLine(horizontalLineX, horizontalLineY, verticalLineStartX, horizontalLineY, canvas.getContext('2d'), true, false);
            //$('#wizardBody').append(canvas);

            var horizontalLocation = imgLeft + imgWidth / 2;
            createLengthBox('totalThreadLength', getTotalProductLength().toFixed(2), 70, horizontalLineY - 10, horizontalLocation - 35);
        }
        if (!isTubeHasThreadEnd) {
            endFittingHorizontalLineTop = imgTop - 90;
            //canvas.getContext('2d').strokeStyle = '#ff1493';
            var endFittingLineFigureLength = pixelCenter + verticalLineStartX;
            drawLine(verticalLineStartX, endFittingHorizontalLineTop, endFittingLineFigureLength, endFittingHorizontalLineTop, canvas.getContext('2d'), true, true);
            var tubeLength = wizardConfiguration[tubeEndFittingConfigurationKey] == null ? 0 : wizardConfiguration[tubeEndFittingConfigurationKey].RowValues[0];
            createLengthBox('tubeEndFittingLength', tubeLength, 20, endFittingHorizontalLineTop - 25, verticalLineStartX + (pixelCenter / 2 - 10));
        }

    }
    else if (!hasExtension && isTubeHasThreadEnd && !isRodHasThreadEnd) {
        //draw the remainting part of the vertical line
        secondVerticalLineLeft = imgLeft + sptialLength;
        secondVerticalLineTop = imgTop - 145;
        drawLine(secondVerticalLineLeft, secondVerticalLineTop, secondVerticalLineLeft, imgTop - 100, canvas.getContext('2d'), false, false);

        drawLine(secondVerticalLineLeft, imgTop - 125, secondVerticalLineLeft + 1, imgTop - 125, canvas.getContext('2d'), true, false);

    }
}

function hideWizardEndControls() {
    $('#imgTubeEndFitting').hide();
    $('#lastStepCanvas').remove();
    $('#extensionLength').remove();
    $('#tubeEndFittingLength').remove();
    var isRodHasThreadEnd = isThreadEndFitting(wizardConfiguration[endFittingKey]);
    if (isRodHasThreadEnd)
        $('#totalThreadLength').remove();
    $('#imgTubeBracket').hide();
}

function endWizard() {
    //Show The bracket and the end fitting.
    $('#imgTubeEndFitting').show();
    $('#imgTubeBracket').show();
    $('.basketCell').show();
    $('#footerButtons').show();
    if (!isWeldedEyesProduct())
        appendTubeFittingLines();

    if (wizardCurrentStepIndex > -1 && wizardCurrentStepIndex < wizardDescriptors.length) {
        //adjust the current control footer and visible controls.
        var descriptor = getStepDescriptor(wizardCurrentStepIndex);
        if (descriptor != null) {
            var stepVisibleControls = descriptor["VisibleControls"];
            var stepControls = descriptor["StepControls"];
            for (var i = 0; i < stepVisibleControls.length; i++) {
                var controlId = stepVisibleControls[i];
                $('#' + controlId).remove();
            }
            for (var k = 0; k < stepControls.length; k++) {
                var stepControlId = stepControls[k];
                $('#' + stepControlId).prop('disabled', true);
            }
        }
        isWizardEnded = true;
        $('#stepDescription').html(getCurrentStepDescription("Step11Description"));
    }
}

function nextStep() {
    if (wizardCurrentStepIndex > -1 && wizardCurrentStepIndex < wizardDescriptors.length) {
        //adjust the current control footer and visible controls.
        computeTotalProductLength();
        var descriptor = getStepDescriptor(wizardCurrentStepIndex);
        if (descriptor != null) {
            var stepVisibleControls = descriptor["VisibleControls"];
            var stepControls = descriptor["StepControls"];
            for (var i = 0; i < stepVisibleControls.length; i++) {
                var controlId = stepVisibleControls[i];
                $('#' + controlId).remove();
            }
            for (var k = 0; k < stepControls.length; k++) {
                var stepControlId = stepControls[k];
                $('#' + stepControlId).prop('disabled', true);
                if ($('#' + stepControlId).hasClass('selector')) {
                    $('#' + stepControlId).addClass('selectorDisabled');
                }
            }
        }
    }
    wizardCurrentStepIndex++;
}

function setStepDescription() {
    var descriptor = getStepDescriptor(wizardCurrentStepIndex);

    $('#stepId').html(getStepTitle());
    if (descriptor != null && descriptor != undefined)
        $('#stepDescription').html(getCurrentStepDescription(descriptor["StepKey"]));
}

function previousStep() {
    $('.basketCell').hide();
    $('#footerButtons').hide();
    hideWizardEndControls();
    if (wizardCurrentStepIndex > -1) {
        computeTotalProductLength();
        log('Will go back one step, wizard index = ' + wizardCurrentStepIndex + ' ,Steps Count = ' + wizardDescriptors.length);
        var descriptor = getStepDescriptor(wizardCurrentStepIndex);
        var allControls = descriptor["AllControls"];
        var footerControls = descriptor["FooterControls"];

        for (var i = 0; i < allControls.length; i++) {
            var controlId = allControls[i];
            $('#' + controlId).remove();
        }
        for (var j = 0; j < footerControls.length; j++) {
            var footerControlId = footerControls[j];
            $('#' + footerControlId).html("");
        }
        if (!isWizardEnded) {
            wizardDescriptors.pop();
            log('Step Poped, Index=' + wizardCurrentStepIndex + ' ,Steps Count =' + wizardDescriptors.length + " ,Current Index = " + wizardCurrentStepIndex);
            wizardCurrentStepIndex--;
        }
        isWizardEnded = false;
        if (wizardCurrentStepIndex == -1) {
            wizardConfiguration = {};
            wizardDescriptors = [];
            productSelected = false;
            showLoading();
            $('#wizardBody').hide();
            $('#springImage').hide();
            $('#springImage').html("");
            $("#wizardFooter").hide();
            setStepDescription();
            wizardResourcesLoaded();
            return;
        }
        descriptor = getStepDescriptor(wizardCurrentStepIndex);
        var redrawMethod = descriptor["Redraw"];
        var args = descriptor["Args"];
        var showSelectionText = true;
        if (redrawMethod != null || redrawMethod != undefined) {
            showSelectionText = false;
            allControls = descriptor["AllControls"];

            for (i = 0; i < allControls.length; i++) {
                controlId = allControls[i];
                $('#' + controlId).remove();
            }
            redrawMethod(args, false);
        }
        var stepControls = descriptor["StepControls"];
        for (var k = 0; k < stepControls.length; k++) {
            var stepControlId = stepControls[k];
            $('#' + stepControlId)[0].selectedIndex = 0;
            $('#' + stepControlId).prop('disabled', false);
            if ($('#' + stepControlId).hasClass('selectorDisabled')) {
                $('#' + stepControlId).removeClass('selectorDisabled');
                $('#' + stepControlId).addClass('selector');
            }
        }
        setStepDescription();
        if (showSelectionText) {
            var selectTextDescriptor = descriptor["SelectTextDescriptor"];
            animateSelectionText(selectTextDescriptor["id"], selectTextDescriptor["localizationKey"], selectTextDescriptor["left"], selectTextDescriptor["top"]);
        }
    }
}

function getStepDescriptor(index) {
    return wizardDescriptors[index];
}

function log(msg) {
    //$('#logger').html(msg);
    // console.log(msg);
}