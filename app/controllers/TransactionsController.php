<?php

namespace APP\Controllers;


use APP\Enums\PaymentStatus;
use APP\Enums\TransactionType;
use APP\Helpers\PublicHelper\PublicHelper;
use APP\Helpers\Structures\Structures;
use APP\LIB\FilterInput;
use APP\LIB\Template\TemplateHelper;
use APP\Models\TransactionsPurchasesModel;
use APP\Models\TransactionsSalesModel;
use Exception;
use ReflectionException;

/**
 *
 */
class TransactionsController extends AbstractController
{
    use FilterInput;
    use PublicHelper;
    use TemplateHelper;
    use structures;



    /**
     * @throws ReflectionException
     * @throws Exception
     */
    public function defaultAction()
    {
        $this->language->load("template.common");
        $this->language->load("transactions.default");

        $transactionsSales = new TransactionsSalesModel();
        $sales = $transactionsSales->getInfoSalesInvoice();

        $transactionsPurchases = new TransactionsPurchasesModel();
        $purchases = $transactionsPurchases->getInfoPurchasesInvoice();


        $this->_info["transactions"] = $this->mergeArraysRandomly(iterator_to_array($sales), iterator_to_array($purchases));

        // Get Type Transaction
        $this->_info["transactionsTypes"] = $this->getSpecificProperties(obj: (new TransactionType()), flip: true);

        // Get Payment status
        $this->_info["paymentsStatus"] = $this->getSpecificProperties(obj: (new PaymentStatus()), flip: true);


        $this->_renderView();
    }



    /**
     * Get[http://estore.local/transactions/purchases]
     * @throws ReflectionException
     * @throws Exception
     */
    public function purchasesAction()
    {
        $this->language->load("template.common");
        $this->language->load("transactions.default");
        $this->language->load("transactions.purchases");

        $transactionsSales = new TransactionsPurchasesModel();

        $this->_info["transactionsPurchases"] = $transactionsSales->getInfoPurchasesInvoice();

        // Get Type Transaction
        $this->_info["transactionsTypes"] = $this->getSpecificProperties(obj: (new TransactionType()), flip: true);

        // Get Payment status
        $this->_info["paymentsStatus"] = $this->getSpecificProperties(obj: (new PaymentStatus()), flip: true);


        $this->_renderView();
    }

    /**
     * GET[http://estore.local/transactions/sales]
     * @throws ReflectionException
     */
    public function salesAction()
    {
        $this->language->load("template.common");
        $this->language->load("transactions.default");

        $transactionsSales = new TransactionsSalesModel();

        $this->_info["transactionsSales"] = $transactionsSales->getInfoSalesInvoice();

        // Get Type Transaction
        $this->_info["transactionsTypes"] = $this->getSpecificProperties(obj: (new TransactionType()), flip: true);

        // Get Payment status
        $this->_info["paymentsStatus"] = $this->getSpecificProperties(obj: (new PaymentStatus()), flip: true);


        $this->_renderView();
    }

    /**
     * http://estore.local/transactions/applyBetweenQueryAjax
     * apply between filter
     * post method to fitch apply filter
     * @throws Exception
     */
    public function applyBetweenQueryAjaxAction()
    {
        $transactionModel = new TransactionsSalesModel();
        $data = $transactionModel->getInfoSalesInvoice([
            "between" => [
                "from"=>$_POST["from"],
                "to"=>$_POST["to"],
                "column"=>"R.Created"
            ],
        ]);

        echo json_encode([
            $data,
            "transactionsTypes" => $this->getSpecificProperties(obj: (new TransactionType()), flip: true),
            "paymentsStatus" => $this->getSpecificProperties(obj: (new PaymentStatus()), flip: true)
        ]);
    }
}